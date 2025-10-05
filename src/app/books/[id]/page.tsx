"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { BookOpen, Star, Calendar, User, Edit, Trash2, ArrowLeft, MessageSquare, BarChart3 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { format } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Book {
  id: string
  title: string
  author: string
  description?: string
  genre?: string
  publishedYear?: number
  avgRating: number
  reviewCount: number
  user: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  reviews: Review[]
}

interface Review {
  id: string
  rating: number
  reviewText?: string
  createdAt: string
  user: {
    id: string
    name: string
  }
}

const getRatingDistribution = (reviews: Review[]) => {
  const distribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating > 1 ? 's' : ''}`,
    count: reviews.filter(review => review.rating === rating).length
  }))
  return distribution
}

export default function BookDetails() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewRating, setReviewRating] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [editingReview, setEditingReview] = useState(false)

  const fetchBook = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/books/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBook(data)
        
        // Find user's review if exists
        if (session?.user?.id) {
          const userReview = data.reviews.find((review: Review) => review.user.id === session.user?.id)
          setUserReview(userReview || null)
          if (userReview) {
            setReviewRating(userReview.rating.toString())
            setReviewText(userReview.reviewText || "")
          }
        }
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error fetching book:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBook()
  }, [params.id, session])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id || !reviewRating) return

    setSubmittingReview(true)

    try {
      const url = editingReview && userReview 
        ? `/api/reviews/${userReview.id}`
        : `/api/reviews`

      const method = editingReview && userReview ? "PUT" : "POST"
      const body = editingReview && userReview
        ? { rating: parseInt(reviewRating), reviewText }
        : { bookId: params.id, rating: parseInt(reviewRating), reviewText }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setReviewRating("")
        setReviewText("")
        setEditingReview(false)
        fetchBook()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!userReview) return

    try {
      const response = await fetch(`/api/reviews/${userReview.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReviewRating("")
        setReviewText("")
        setUserReview(null)
        setEditingReview(false)
        fetchBook()
      }
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  const handleDeleteBook = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/")
      }
    } catch (error) {
      console.error("Error deleting book:", error)
    }
  }

  const renderStars = (rating: number, size = "normal") => {
    const starSize = size === "large" ? "h-6 w-6" : "h-4 w-4"
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : star === Math.ceil(rating) && rating % 1 !== 0
                ? "text-yellow-400 fill-current opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className={`ml-1 ${size === "large" ? "text-lg" : "text-sm"} text-gray-600`}>
          {rating > 0 ? rating.toFixed(1) : "No reviews"}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">BookReview</h1>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {session ? (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">
                    Welcome, {session.user?.name}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/api/auth/signout")}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/signin">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2">{book.title}</CardTitle>
                    <CardDescription className="text-lg">by {book.author}</CardDescription>
                  </div>
                  {session?.user?.id === book.user.id && (
                    <div className="flex gap-2">
                      <Link href={`/books/${book.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the book and all its reviews.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteBook}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 items-center mt-4">
                  {book.genre && (
                    <Badge variant="secondary">{book.genre}</Badge>
                  )}
                  {book.publishedYear && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{book.publishedYear}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Added by {book.user.name}</span>
                  </div>
                </div>

                <div className="mt-4">
                  {renderStars(book.avgRating, "large")}
                  <div className="text-sm text-gray-600 mt-1">
                    {book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {book.description && (
                  <div className="prose prose-gray max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{book.description}</p>
                  </div>
                )}

                {/* Rating Distribution Chart */}
                {book.reviews.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Rating Distribution
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={getRatingDistribution(book.reviews)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="rating" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews ({book.reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {book.reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Be the first to review this book!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {book.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">{review.user.name}</div>
                            {renderStars(review.rating)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(review.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                        {review.reviewText && (
                          <p className="text-gray-700 mt-2">{review.reviewText}</p>
                        )}
                        {session?.user?.id === review.user.id && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReviewRating(review.rating.toString())
                                setReviewText(review.reviewText || "")
                                setEditingReview(true)
                              }}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your review.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteReview}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>
                  {userReview ? "Your Review" : session ? "Write a Review" : "Sign in to Review"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {session ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <Select value={reviewRating} onValueChange={setReviewRating} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                          <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                          <SelectItem value="1">⭐ (1 star)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review (Optional)
                      </label>
                      <Textarea
                        placeholder="Share your thoughts about this book..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={!reviewRating || submittingReview}
                        className="flex-1"
                      >
                        {submittingReview
                          ? "Submitting..."
                          : editingReview
                          ? "Update Review"
                          : userReview
                          ? "Submit New Review"
                          : "Submit Review"}
                      </Button>
                      
                      {userReview && !editingReview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setReviewRating(userReview.rating.toString())
                            setReviewText(userReview.reviewText || "")
                            setEditingReview(true)
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      
                      {editingReview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingReview(false)
                            setReviewRating("")
                            setReviewText("")
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Sign in to write a review for this book
                    </p>
                    <Link href="/auth/signin">
                      <Button>Sign In</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}