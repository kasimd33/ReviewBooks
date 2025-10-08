import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    // This endpoint is public - no authentication required
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "5")
    const search = searchParams.get("search") || ""
    const genre = searchParams.get("genre") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const skip = (page - 1) * limit
    const db = await getDb()

    const filter: any = {}
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ]
    }

    if (genre && genre !== "all") {
      filter.genre = { $regex: genre, $options: "i" }
    }

    const sort: any = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    const [books, total] = await Promise.all([
      db.collection('books').find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      db.collection('books').countDocuments(filter),
    ])

    const booksWithDetails = await Promise.all(books.map(async (book) => {
      const reviews = await db.collection('reviews').find({ bookId: book._id.toString() }).toArray()
      
      // Try to find user by ObjectId first, then by string
      let user = null
      try {
        user = await db.collection('users').findOne({ _id: new ObjectId(book.addedBy) })
      } catch {
        user = await db.collection('users').findOne({ _id: book.addedBy as any })
      }
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, review: any) => sum + review.rating, 0) / reviews.length
        : 0

      return {
        ...book,
        id: book._id.toString(),
        user: user ? { id: user._id.toString(), name: user.name, email: user.email } : null,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      }
    }))

    return NextResponse.json({
      books: booksWithDetails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get books error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, author, description, genre, publishedYear } = await request.json()

    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Find user first to get their info
    let user = null
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) })
    } catch {
      // If ObjectId conversion fails, try finding by string ID
      user = await db.collection('users').findOne({ _id: session.user.id as any })
    }
    
    const result = await db.collection('books').insertOne({
      title,
      author,
      description,
      genre,
      publishedYear: publishedYear ? parseInt(publishedYear) : null,
      addedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      message: "Book created successfully",
      book: {
        id: result.insertedId.toString(),
        title,
        author,
        description,
        genre,
        publishedYear,
        addedBy: session.user.id,
        user: user ? { id: user._id.toString(), name: user.name, email: user.email } : null
      },
    })
  } catch (error) {
    console.error("Create book error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}