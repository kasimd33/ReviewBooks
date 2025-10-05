"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/ui/search-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, Star, Calendar, User, Menu, X } from "lucide-react"

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
}

export default function BooksPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: searchTerm,
        genre: selectedGenre === "all" ? "" : selectedGenre,
      })
      const response = await fetch(`/api/books?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [searchTerm, selectedGenre])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating > 0 ? rating.toFixed(1) : "No reviews"}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
          <nav className="flex justify-between items-center mb-12">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BookReview.</h1>
                <p className="text-xs text-gray-500">By Kasim</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors">Home</Link>
              <Link href="/profile" className="text-gray-700 hover:text-purple-600 transition-colors">Profile</Link>
              <Link href="/books" className="text-purple-600 font-semibold">Books</Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">About</Link>
            </div>
            
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/books/add" className="hidden sm:block">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6">
                      Add Book
                    </Button>
                  </Link>
                  <Button
                    onClick={() => router.push("/api/auth/signout")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 hidden sm:block"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth/signup" className="hidden sm:block">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6">
                    Sign Up
                  </Button>
                </Link>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="md:hidden rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </nav>
          
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/profile" className="text-gray-700 hover:text-purple-600 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <Link href="/books" className="text-purple-600 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>Books</Link>
                <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
                {session ? (
                  <>
                    <Link href="/books/add" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-full">
                        Add Book
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        router.push("/api/auth/signout")
                        setMobileMenuOpen(false)
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-full">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Book Collection
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Browse & Discover
                </span>
              </h2>
              <h3 className="text-2xl font-semibold text-purple-600 mb-4">
                Explore Amazing Books
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Discover your next favorite read from our curated collection of books across all genres.
              </p>
              {session && (
                <Link href="/books/add">
                  <Button className="bg-white text-gray-700 hover:bg-gray-50 rounded-full px-8 py-3 text-lg shadow-lg">
                    Add New Book
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSubmit={() => fetchBooks()}
                placeholder="Search books by title or author..."
                className="shadow-lg"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-48 rounded-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                  <SelectItem value="Fantasy">Fantasy</SelectItem>
                  <SelectItem value="Biography">Biography</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0">
                <CardHeader>
                  <div className="h-4 bg-purple-200 rounded-full w-3/4"></div>
                  <div className="h-3 bg-purple-100 rounded-full w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedGenre !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to add a book to our collection!"}
            </p>
            {session && (
              <Link href="/books/add">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Book
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <Link href={`/books/${book.id}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-black">{book.title}</h3>
                        <p className="text-gray-600 text-sm">by {book.author}</p>
                      </div>
                      {book.genre && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                          {book.genre}
                        </Badge>
                      )}
                    </div>

                    {book.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {book.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{book.publishedYear || "Unknown year"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="truncate max-w-20">{book.user.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {renderStars(book.avgRating)}
                      <span className="text-sm text-gray-500">
                        {book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}