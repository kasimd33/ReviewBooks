import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb()
    const book = await db.collection('books').findOne({ _id: new ObjectId(params.id) })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    let user = null
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(book.addedBy) })
    } catch {
      user = await db.collection('users').findOne({ _id: book.addedBy as any })
    }
    
    const reviews = await db.collection('reviews').find({ bookId: params.id }).sort({ createdAt: -1 }).toArray()

    const reviewsWithUsers = await Promise.all(reviews.map(async (review) => {
      let reviewUser = null
      try {
        reviewUser = await db.collection('users').findOne({ _id: new ObjectId(review.userId) })
      } catch {
        reviewUser = await db.collection('users').findOne({ _id: review.userId as any })
      }
      return {
        ...review,
        id: review._id.toString(),
        user: reviewUser ? { id: reviewUser._id.toString(), name: reviewUser.name } : null
      }
    }))

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review: any) => sum + review.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      ...book,
      id: book._id.toString(),
      user: user ? { id: user._id.toString(), name: user.name, email: user.email } : null,
      reviews: reviewsWithUsers,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    })
  } catch (error) {
    console.error("Get book error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, author, description, genre, publishedYear } = await request.json()

    const db = await getDb()
    const existingBook = await db.collection('books').findOne({ _id: new ObjectId(params.id) })

    if (!existingBook) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    if (existingBook.addedBy !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own books" },
        { status: 403 }
      )
    }

    await db.collection('books').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          title,
          author,
          description,
          genre,
          publishedYear: publishedYear ? parseInt(publishedYear) : null,
          updatedAt: new Date()
        }
      }
    )

    const book = await db.collection('books').findOne({ _id: new ObjectId(params.id) })
    
    let user = null
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) })
    } catch {
      user = await db.collection('users').findOne({ _id: session.user.id as any })
    }

    return NextResponse.json({
      message: "Book updated successfully",
      book: {
        ...book,
        id: book?._id.toString(),
        user: user ? { id: user._id.toString(), name: user.name, email: user.email } : null
      },
    })
  } catch (error) {
    console.error("Update book error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const db = await getDb()
    const existingBook = await db.collection('books').findOne({ _id: new ObjectId(params.id) })

    if (!existingBook) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    if (existingBook.addedBy !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own books" },
        { status: 403 }
      )
    }

    await db.collection('books').deleteOne({ _id: new ObjectId(params.id) })
    await db.collection('reviews').deleteMany({ bookId: params.id })

    return NextResponse.json({
      message: "Book deleted successfully",
    })
  } catch (error) {
    console.error("Delete book error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
