import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("bookId")
    const userId = searchParams.get("userId")

    const filter: any = {}
    
    if (bookId) {
      filter.bookId = bookId
    }
    
    if (userId) {
      filter.userId = userId
    }

    const db = await getDb()
    const reviewsData = await db.collection('reviews').find(filter).sort({ createdAt: -1 }).toArray()

    const reviews = await Promise.all(reviewsData.map(async (review) => {
      let user = null
      try {
        user = await db.collection('users').findOne({ _id: new ObjectId(review.userId) })
      } catch {
        user = await db.collection('users').findOne({ _id: review.userId as any })
      }
      
      let book = null
      try {
        book = await db.collection('books').findOne({ _id: new ObjectId(review.bookId) })
      } catch {
        book = await db.collection('books').findOne({ _id: review.bookId as any })
      }
      
      return {
        ...review,
        id: review._id.toString(),
        user: user ? { id: user._id.toString(), name: user.name } : null,
        book: book ? { id: book._id.toString(), title: book.title, author: book.author } : null
      }
    }))

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Get reviews error:", error)
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

    const { bookId, rating, reviewText } = await request.json()

    if (!bookId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid book ID and rating (1-5) are required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    const existingReview = await db.collection('reviews').findOne({
      bookId,
      userId: session.user.id
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 }
      )
    }

    const result = await db.collection('reviews').insertOne({
      bookId,
      userId: session.user.id,
      rating,
      reviewText,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    let user = null
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) })
    } catch {
      user = await db.collection('users').findOne({ _id: session.user.id as any })
    }

    return NextResponse.json({
      message: "Review created successfully",
      review: {
        id: result.insertedId.toString(),
        bookId,
        userId: session.user.id,
        rating,
        reviewText,
        user: user ? { id: user._id.toString(), name: user.name } : null,
        book: { id: book._id.toString(), title: book.title, author: book.author }
      },
    })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}