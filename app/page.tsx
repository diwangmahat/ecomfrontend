"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Truck,
  RotateCcw,
  Shield,
  ArrowRight,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  TrendingUp,
} from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description?: string
  featured?: boolean
  isNew?: boolean
  onSale?: boolean
  originalPrice?: number
}

interface Testimonial {
  id: number
  name: string
  rating: number
  comment: string
  image: string
  verified: boolean
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing quality and perfect fit! The fabric is so comfortable and the design is exactly what I was looking for.",
      image: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment:
        "Fast shipping and excellent customer service. The clothes exceeded my expectations in terms of quality.",
      image: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 5,
      comment: "Love the sustainable approach and the attention to detail. Will definitely be ordering more!",
      image: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
  ]

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Award, value: "99%", label: "Satisfaction Rate" },
    { icon: TrendingUp, value: "4.9", label: "Average Rating" },
    { icon: Truck, value: "24h", label: "Fast Delivery" },
  ]

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ecommerce-backend-340r.onrender.com"
        const res = await fetch(`${apiUrl}/api/products?limit=8`)

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`)
        }

        const data = await res.json()
        const products = (data.products || data || []).map((product: Product, index: number) => ({
          ...product,
          isNew: index < 2,
          onSale: index === 2 || index === 5,
          originalPrice: index === 2 || index === 5 ? product.price * 1.3 : undefined,
        }))
        setFeaturedProducts(products)
      } catch (err) {
        console.error("Failed to fetch featured products:", err)
        // Fallback to mock data
        setFeaturedProducts([
          {
            id: "1",
            name: "Essential Cotton Tee",
            price: 29.99,
            image: "/images/women-tshirt1.jpg",
            category: "basics",
            featured: true,
            isNew: true,
          },
          {
            id: "2",
            name: "Comfort Fit Joggers",
            price: 49.99,
            originalPrice: 64.99,
            image: "/images/men-pants1.jpg",
            category: "bottoms",
            featured: true,
            onSale: true,
          },
          {
            id: "3",
            name: "Ribbed Tank Top",
            price: 24.99,
            image: "/images/women-tshirt2.jpg",
            category: "basics",
            featured: true,
            isNew: true,
          },
          {
            id: "4",
            name: "Classic Crew Neck",
            price: 34.99,
            image: "/images/men-tshirt2.jpg",
            category: "basics",
            featured: true,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden text-white">
        {/* Local Video */}
        <video className="absolute inset-0 w-full h-full object-cover z-0" autoPlay muted loop playsInline>
          <source src="/video/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>

        {/* Text content */}
        <div className="relative z-20 flex items-center justify-center h-full text-center px-4 max-w-4xl mx-auto">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Style Meets <span className="text-blue-400">Comfort</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover our premium collection of clothing and accessories designed for the modern lifestyle
            </p>
            <div className="space-x-4">
              <Link href="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products?category=new">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-black hover:bg-gray-700 hover:text-white px-8 py-3"
                >
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">SHOP BY CATEGORY</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every occasion and style preference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/products?gender=Women" className="group relative overflow-hidden">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/women-shirt2.jpg"
                  alt="Women's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-light mb-2">WOMEN</h3>
                  <p className="text-sm tracking-wide opacity-90">SHOP COLLECTION</p>
                </div>
              </div>
            </Link>

            <Link href="/products?gender=Men" className="group relative overflow-hidden">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/men-shirt2.jpg"
                  alt="Men's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-light mb-2">MEN</h3>
                  <p className="text-sm tracking-wide opacity-90">SHOP COLLECTION</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">FEATURED</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most loved pieces, carefully selected for their exceptional quality and timeless appeal.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="bg-white relative">
                    {/* Product Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                      {product.isNew && <Badge className="bg-black text-white text-xs px-2 py-1">NEW</Badge>}
                      {product.onSale && <Badge className="bg-red-600 text-white text-xs px-2 py-1">SALE</Badge>}
                    </div>

                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-100 aspect-square mb-3">
                      <Image
                        src={product.image || "/placeholder.svg?height=400&width=400"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                      <h3 className="text-sm text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      {product.category && <p className="text-xs text-gray-500 capitalize">{product.category}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg" className="px-8 py-3 text-sm font-medium tracking-wide">
                VIEW ALL
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-light text-gray-900 tracking-wide">OUR STORY</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Founded with a passion for quality and sustainability, StyleHub represents the perfect blend of
                contemporary design and timeless elegance. Every piece in our collection is thoughtfully crafted to
                enhance your personal style while respecting our planet.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From our ethically sourced materials to our commitment to fair trade practices, we believe that fashion
                should feel as good as it looks. Join us in creating a more sustainable future, one outfit at a time.
              </p>
              <Link href="/about">
                <Button variant="outline" className="mt-4">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <Image src="/images/men-shirt5.jpg" alt="Our Story" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm opacity-90">Sustainable Fashion</p>
                  <h3 className="text-xl font-light">Crafted with Care</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">WHAT OUR CUSTOMERS SAY</h2>
            <p className="text-gray-600">Real reviews from real customers</p>
          </div>

          <div className="relative">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center">
                  <Quote className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-6 italic">"{testimonials[currentTestimonial].comment}"</p>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{testimonials[currentTestimonial].name}</p>
                      {testimonials[currentTestimonial].verified && (
                        <p className="text-sm text-green-600">✓ Verified Purchase</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 tracking-wide">FREE SHIPPING</h3>
              <p className="text-sm text-gray-600">On orders over $75</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 tracking-wide">EASY RETURNS</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 tracking-wide">SECURE PAYMENT</h3>
              <p className="text-sm text-gray-600">Safe & secure checkout</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
