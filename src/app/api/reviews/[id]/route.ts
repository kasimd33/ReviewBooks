import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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

    // Check if review exists and user owns it
    const existingReview = await db.review.findUnique({
      where: { id: params.id },
    })

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

    const review = await db.review.update({
      where: { id: params.id },
      data: {
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
      message: "Review updated successfully",
      review,
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

    // Check if review exists and user owns it
    const existingReview = await db.review.findUnique({
      where: { id: params.id },
    })

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

    await db.review.delete({
      where: { id: params.id },
    })

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