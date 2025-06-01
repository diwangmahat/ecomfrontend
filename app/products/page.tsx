"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Grid3X3, List, SlidersHorizontal } from "lucide-react"
import type { Product } from "../context/cart-context"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
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

        if (gender) {
          params.append("gender", gender)
          setSelectedGender(gender)
        }

        if (category) {
          params.append("category", category)
          setSelectedCategory(category)
        }

        const queryString = params.toString()
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ecommerce-backend-340r.onrender.com"
        const url = `${apiUrl}/api/products${queryString ? `?${queryString}` : ""}`

        const res = await fetch(url)
        const data = await res.json()

        const productList: Product[] = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : []

        setProducts(productList)
        setFilteredProducts(productList)

        // Extract unique values for filters
        const uniqueCategories = Array.from(new Set(productList.map((p) => p.category))).filter(Boolean) as string[]
        const uniqueColors = Array.from(
          new Set(productList.flatMap((p) => (Array.isArray(p.color) ? p.color : [p.color]))),
        ).filter(Boolean) as string[]
        const uniqueSizes = Array.from(
          new Set(productList.flatMap((p) => (Array.isArray(p.size) ? p.size : [p.size]))),
        ).filter(Boolean) as string[]

        setCategories(uniqueCategories)
        setColors(uniqueColors)
        setSizes(uniqueSizes)
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

    if (selectedColor !== "all") {
      filtered = filtered.filter((p) => {
        const productColors = Array.isArray(p.color) ? p.color : [p.color]
        return productColors.includes(selectedColor)
      })
    }

    if (selectedSize !== "all") {
      filtered = filtered.filter((p) => {
        const productSizes = Array.isArray(p.size) ? p.size : [p.size]
        return productSizes.includes(selectedSize)
      })
    }

    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        switch (priceRange) {
          case "under-25":
            return p.price < 25
          case "25-50":
            return p.price >= 25 && p.price <= 50
          case "50-100":
            return p.price >= 50 && p.price <= 100
          case "over-100":
            return p.price > 100
          default:
            return true
        }
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedGender, selectedColor, selectedSize, priceRange, sortBy])

  const getPageTitle = () => {
    const gender = searchParams.get("gender")
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
            {[1, 2, 3, 4, 5].map((i) => (
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

            {/* Size */}
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-[100px] h-9 text-sm">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Colour */}
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue placeholder="Colour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colours</SelectItem>
                {colors.map((color) => (
                  <SelectItem key={color} value={color} className="capitalize">
                    {color}
                  </SelectItem>
                ))}
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

            {/* More Filters Button */}
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-9 text-sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              MORE FILTERS +
            </Button>

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
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className="bg-white">
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100 aspect-square mb-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                <h3 className="text-sm text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                {product.category && <p className="text-xs text-gray-500 capitalize">{product.category}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <Button
            onClick={() => {
              setSelectedCategory("all")
              setSelectedGender("all")
              setSelectedColor("all")
              setSelectedSize("all")
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
