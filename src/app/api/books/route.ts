import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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

    // Build where clause for filtering
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ]
    }

    if (genre && genre !== "all") {
      where.genre = { contains: genre, mode: "insensitive" }
    }

    // Build orderBy clause for sorting
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [books, total] = await Promise.all([
      db.book.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.book.count({ where }),
    ])

    // Calculate average rating for each book
    const booksWithAvgRating = books.map((book) => {
      const avgRating = book.reviews.length > 0
        ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
        : 0

      return {
        ...book,
        avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
        reviewCount: book.reviews.length,
      }
    })

    return NextResponse.json({
      books: booksWithAvgRating,
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

    const book = await db.book.create({
      data: {
        title,
        author,
        description,
        genre,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        addedBy: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: "Book created successfully",
      book,
    })
  } catch (error) {
    console.error("Create book error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}