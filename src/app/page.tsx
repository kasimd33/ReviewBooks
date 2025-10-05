"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchBar } from "@/components/ui/search-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Search, Plus, Star, Calendar, User, LogOut, Settings, Twitter, Linkedin, Facebook, Instagram, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { format } from "date-fns"

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

interface BooksResponse {
  books: Book[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        genre: selectedGenre,
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/books?${params}`)
      if (response.ok) {
        const data: BooksResponse = await response.json()
        setBooks(data.books)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchBooks()
    }
  }, [session, pagination.page, searchTerm, selectedGenre, sortBy, sortOrder])

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchBooks()
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : star === Math.ceil(rating) && rating % 1 !== 0
                ? "text-yellow-400 fill-current opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-700 font-medium ml-1">
          {rating > 0 ? rating.toFixed(1) : "No reviews"}
        </span>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Landing page for non-logged-in users
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
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
                <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">About</Link>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/auth/signin" className="hidden sm:block">
                  <Button variant="outline" className="rounded-full px-6 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-500 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-200">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 active:scale-95">Sign Up</Button>
                </Link>
              </div>
            </nav>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Book Review</span>
                </h2>
                <h3 className="text-2xl font-semibold text-purple-600 mb-4">Free Book Review Platform</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md">
                  Our platform will make your reading experience unique, modern and stylish. Join thousands of readers sharing their thoughts and discovering new books.
                </p>
                <Link href="/auth/signup">
                  <Button className="bg-white text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white rounded-full px-8 py-3 text-lg shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 active:scale-95">Join Us Now</Button>
                </Link>
              </div>
              
              <div className="relative h-80 hidden lg:block group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <video autoPlay loop muted playsInline className="relative w-full h-full object-cover rounded-3xl shadow-2xl group-hover:scale-105 group-hover:shadow-purple-500/50 transition-all duration-300">
                  <source src="https://cdn.pixabay.com/video/2020/09/08/49375-459436752_large.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            
            <div className="flex gap-4 mt-12">
              <Twitter className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-all duration-300 hover:scale-125 hover:-translate-y-1" />
              <Linkedin className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-all duration-300 hover:scale-125 hover:-translate-y-1" />
              <Facebook className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-all duration-300 hover:scale-125 hover:-translate-y-1" />
              <Instagram className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-all duration-300 hover:scale-125 hover:-translate-y-1" />
            </div>
          </div>
          
          {/* Features Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mt-8">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Why Choose BookReview?</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/50">
                  <BookOpen className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Discover Books</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Explore thousands of book reviews and find your next favorite read from our community.</p>
              </div>
              
              <div className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-pink-500/50">
                  <Star className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Share Reviews</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Write and share your honest reviews to help other readers make informed choices.</p>
              </div>
              
              <div className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/50">
                  <User className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Join Community</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Connect with fellow book lovers and engage in meaningful discussions about literature.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Books page for logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
          {/* Navigation */}
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
              <Link href="/books" className="text-gray-700 hover:text-purple-600 transition-colors">Books</Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">About</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {session ? (
                <>
                  <Link href="/books/add" className="hidden sm:block">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 active:scale-95">
                      Add Book
                    </Button>
                  </Link>
                  <Button
                    onClick={() => router.push("/api/auth/signout")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 hidden sm:block hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 active:scale-95"
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
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/profile" className="text-gray-700 hover:text-purple-600 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <Link href="/books" className="text-gray-700 hover:text-purple-600 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Books</Link>
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

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Book Review
                </span>
              </h2>
              <h3 className="text-2xl font-semibold text-purple-600 mb-4">
                Free Book Review Platform
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Our platform will make your reading experience unique, modern and stylish.
              </p>
              <Button className="bg-white text-gray-700 hover:bg-gray-50 rounded-full px-8 py-3 text-lg shadow-lg">
                Join Us Now
              </Button>
            </div>
            
            {/* Animated Books Video */}
            <div className="relative h-80 hidden lg:block group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl group-hover:scale-105 group-hover:shadow-purple-500/50 transition-all duration-300"
              >
                <source src="https://cdn.pixabay.com/video/2020/09/08/49375-459436752_large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-4 mt-12">
            <Twitter className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSubmit={() => {
                  setPagination(prev => ({ ...prev, page: 1 }))
                  fetchBooks()
                }}
                placeholder="Search books by title or author..."
                className="shadow-lg"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-48 rounded-full border-2 border-purple-200 hover:border-purple-400 transition-colors bg-white text-gray-900 font-medium">
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 rounded-full border-2 border-purple-200 hover:border-purple-400 transition-colors bg-white text-gray-900 font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="publishedYear">Year</SelectItem>
                  <SelectItem value="avgRating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0">
                <CardHeader>
                  <div className="h-4 bg-purple-200 rounded-full w-3/4"></div>
                  <div className="h-3 bg-purple-100 rounded-full w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-purple-100 rounded-full"></div>
                    <div className="h-3 bg-purple-100 rounded-full w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedGenre
                ? "Try adjusting your search or filters"
                : "Be the first to add a book to our collection!"}
            </p>
            {session && (
              <Link href="/books/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Book
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {books.map((book) => (
                <Card key={book.id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
                  <Link href={`/books/${book.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 text-gray-900">{book.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-700 font-medium">by {book.author}</CardDescription>
                        </div>
                        {book.genre && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                            {book.genre}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {book.description && (
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {book.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-700 font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-700" />
                            <span>
                              {book.publishedYear || "Unknown year"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-700" />
                            <span className="truncate max-w-20">
                              {book.user.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {renderStars(book.avgRating)}
                          <span className="text-sm text-gray-700 font-medium">
                            {book.reviewCount} {book.reviewCount === 1 ? "review" : "reviews"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === pagination.page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className={pagination.page === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}