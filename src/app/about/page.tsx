"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Star, Heart, Target, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">BookReview</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're passionate about connecting readers with amazing books and creating a community where literary discussions thrive.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                BookReview is more than just a platform – it's a community of book lovers dedicated to discovering, sharing, and celebrating great literature.
              </p>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-3 text-lg">
                  Join Our Community
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8">
                <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  Discover Your Next Great Read
                </h3>
                <p className="text-center text-gray-600">
                  Join thousands of readers sharing their favorite books.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Built by readers, for readers. Our community shares honest reviews and recommendations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Quality Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Detailed, thoughtful reviews that go beyond star ratings with real insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Personalized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Discover books tailored to your taste with personalized recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community of passionate readers and discover your next favorite book today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-semibold">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/books">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3 text-lg">
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}