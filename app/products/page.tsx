"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, List, SlidersHorizontal } from "lucide-react"
import type { Product } from "../context/cart-context"

// Backend product type (what we receive from API)
interface BackendProduct {
  id: number | string
  name: string
  price: number
  image?: string | string[]
  category?: string
  description?: string
  gender?: string
  size?: string | string[]
  color?: string | string[]
  brand?: string
  countInStock?: number
  onSale?: boolean
  salePrice?: number
  isNew?: boolean
  featured?: boolean
  rating?: number
  numReviews?: number
  createdAt?: string
  updatedAt?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const params = new URLSearchParams()

        const gender = searchParams.get("gender")
        const category = searchParams.get("category")
        const keyword = searchParams.get("keyword")
        const onSale = searchParams.get("onSale")

        if (gender) {
          params.append("gender", gender)
          setSelectedGender(gender)
        }

        if (category) {
          params.append("category", category)
          setSelectedCategory(category)
        }

        if (keyword) {
          params.append("keyword", keyword)
        }

        if (onSale) {
          params.append("onSale", onSale)
        }

        const queryString = params.toString()
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
        const url = `${apiUrl}/api/products${queryString ? `?${queryString}` : ""}`

        const res = await fetch(url)
        const data = await res.json()

        // Handle both direct array and object with products array
        const productList: BackendProduct[] = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : []

        // Normalize product data to match our Product interface
        const normalizedProducts: Product[] = productList.map((product) => {
          // Handle size normalization
          let normalizedSize: string[] = []
          if (typeof product.size === "string" && product.size.trim() !== "") {
            normalizedSize = product.size
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s !== "")
          } else if (Array.isArray(product.size)) {
            normalizedSize = product.size
          }

          // Handle color normalization
          let normalizedColor: string[] = []
          if (typeof product.color === "string" && product.color.trim() !== "") {
            normalizedColor = product.color
              .split(",")
              .map((c: string) => c.trim())
              .filter((c: string) => c !== "")
          } else if (Array.isArray(product.color)) {
            normalizedColor = product.color
          }

          // Handle image normalization
          let normalizedImage: string | string[]
          if (typeof product.image === "string") {
            normalizedImage = [product.image]
          } else if (Array.isArray(product.image)) {
            normalizedImage = product.image
          } else {
            normalizedImage = ["/placeholder.svg"]
          }

          return {
            id: String(product.id), // Convert to string
            name: product.name,
            price: product.price,
            image: normalizedImage,
            category: product.category || "",
            description: product.description || "",
            gender: product.gender,
            size: normalizedSize,
            color: normalizedColor,
            brand: product.brand,
            countInStock: product.countInStock || 0,
            onSale: product.onSale || false,
            salePrice: product.salePrice,
            isNew: product.isNew || false,
            featured: product.featured || false,
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
          }
        })

        setProducts(normalizedProducts)
        setFilteredProducts(normalizedProducts)

        // Extract unique values for filters
        const uniqueCategories = Array.from(new Set(normalizedProducts.map((p) => p.category))).filter(
          Boolean,
        ) as string[]

        setCategories(uniqueCategories)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  useEffect(() => {
    let filtered = [...products]

    // Apply filters
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (selectedGender !== "all") {
      filtered = filtered.filter((p) => p.gender === selectedGender)
    }

    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        const price = p.onSale && p.salePrice ? p.salePrice : p.price
        switch (priceRange) {
          case "under-25":
            return price < 25
          case "25-50":
            return price >= 25 && price <= 50
          case "50-100":
            return price >= 50 && price <= 100
          case "over-100":
            return price > 100
          default:
            return true
        }
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price
          return priceA - priceB
        case "price-high":
          const priceA2 = a.onSale && a.salePrice ? a.salePrice : a.price
          const priceB2 = b.onSale && b.salePrice ? b.salePrice : b.price
          return priceB2 - priceA2
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedGender, priceRange, sortBy])

  const getPageTitle = () => {
    const gender = searchParams.get("gender")
    const keyword = searchParams.get("keyword")
    
    if (keyword) return `Search results for "${keyword}"`
    if (gender === "Men") return "Men's Products"
    if (gender === "Women") return "Women's Products"
    return "All Products"
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{getPageTitle()}</h1>

        {/* Filters Bar */}
        <div className="bg-white border-b border-gray-200 pb-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Product Type */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-25">Under $25</SelectItem>
                <SelectItem value="25-50">$25 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="over-100">Over $100</SelectItem>
              </SelectContent>
            </Select>

            {/* Gender */}
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Men">Men</SelectItem>
                <SelectItem value="Women">Women</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <div className="ml-auto flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm font-medium text-gray-900">{filteredProducts.length} PRODUCTS</p>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {filteredProducts.map((product) => {
          const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price
          const originalPrice = product.onSale && product.salePrice ? product.price : null
          const productImage = Array.isArray(product.image) ? product.image[0] : product.image

          return (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-white">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100 aspect-square mb-3">
                  <Image
                    src={productImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.onSale && <Badge className="bg-red-600 text-white text-xs px-2 py-1">SALE</Badge>}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900">${displayPrice.toFixed(2)}</p>
                    {originalPrice && <p className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</p>}
                  </div>
                  <h3 className="text-sm text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  {product.category && <p className="text-xs text-gray-500 capitalize">{product.category}</p>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <Button
            onClick={() => {
              setSelectedCategory("all")
              setSelectedGender("all")
              setPriceRange("all")
            }}
            className="mt-4"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}