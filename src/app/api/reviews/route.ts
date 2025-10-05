import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("bookId")
    const userId = searchParams.get("userId")

    const where: any = {}
    
    if (bookId) {
      where.bookId = bookId
    }
    
    if (userId) {
      where.userId = userId
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

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

    // Check if book exists
    const book = await db.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    // Check if user already reviewed this book
    const existingReview = await db.review.findUnique({
      where: {
        bookId_userId: {
          bookId,
          userId: session.user.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 }
      )
    }

    const review = await db.review.create({
      data: {
        bookId,
        userId: session.user.id,
        rating,
        reviewText,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: "Review created successfully",
      review,
    })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}