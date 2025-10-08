import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

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

    const { rating, reviewText } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid rating (1-5) is required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const existingReview = await db.collection('reviews').findOne({ _id: new ObjectId(params.id) })

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own reviews" },
        { status: 403 }
      )
    }

    await db.collection('reviews').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          rating,
          reviewText,
          updatedAt: new Date()
        }
      }
    )

    const review = await db.collection('reviews').findOne({ _id: new ObjectId(params.id) })
    
    let user = null
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) })
    } catch {
      user = await db.collection('users').findOne({ _id: session.user.id as any })
    }
    
    let book = null
    try {
      book = await db.collection('books').findOne({ _id: new ObjectId(review?.bookId) })
    } catch {
      book = await db.collection('books').findOne({ _id: review?.bookId as any })
    }

    return NextResponse.json({
      message: "Review updated successfully",
      review: {
        ...review,
        id: review?._id.toString(),
        user: user ? { id: user._id.toString(), name: user.name } : null,
        book: book ? { id: book._id.toString(), title: book.title, author: book.author } : null
      },
    })
  } catch (error) {
    console.error("Update review error:", error)
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
    const existingReview = await db.collection('reviews').findOne({ _id: new ObjectId(params.id) })

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own reviews" },
        { status: 403 }
      )
    }

    await db.collection('reviews').deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({
      message: "Review deleted successfully",
    })
  } catch (error) {
    console.error("Delete review error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
