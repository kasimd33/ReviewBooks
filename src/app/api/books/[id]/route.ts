import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await db.book.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating = book.reviews.length > 0
      ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
      : 0

    return NextResponse.json({
      ...book,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: book.reviews.length,
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

    // Check if book exists and user owns it
    const existingBook = await db.book.findUnique({
      where: { id: params.id },
    })

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

    const book = await db.book.update({
      where: { id: params.id },
      data: {
        title,
        author,
        description,
        genre,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
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
      message: "Book updated successfully",
      book,
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

    // Check if book exists and user owns it
    const existingBook = await db.book.findUnique({
      where: { id: params.id },
    })

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

    await db.book.delete({
      where: { id: params.id },
    })

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