"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart, type Product } from "../../context/cart-context"
import { useWishlist } from "../../context/wishlist-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Truck, RotateCcw, Shield, Plus, Minus } from "lucide-react"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { dispatch } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const router = useRouter()

  const isProductInWishlist = product ? isInWishlist(product.id) : false

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
        const res = await fetch(`${apiUrl}/api/products/${params.id}`)

        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`)
        }

        const data = await res.json()

        // Normalize the product data to match your backend structure
        const normalizedProduct: Product = {
          ...data,
          size:
            typeof data.size === "string"
              ? data.size.split(",").map((s: string) => s.trim())
              : Array.isArray(data.size)
                ? data.size
                : [],
          color:
            typeof data.color === "string"
              ? data.color.split(",").map((c: string) => c.trim())
              : Array.isArray(data.color)
                ? data.color
                : [],
          image:
            typeof data.image === "string"
              ? [data.image]
              : Array.isArray(data.image)
                ? data.image
                : [data.image || "/placeholder.svg"],
        }

        setProduct(normalizedProduct)
      } catch (err) {
        console.error("Failed to fetch product:", err)
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) {
      alert("Product not found")
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        quantity,
      },
    })

    alert("Added to cart!")
  }

  const handleBuyNow = () => {
    if (!product) {
      alert("Product not found")
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        quantity,
      },
    })

    router.push("/checkout")
  }

  const handleWishlistToggle = () => {
    if (!product) return

    // Get the first image if it's an array, otherwise use the string
    const productImage = Array.isArray(product.image) ? product.image[0] : product.image

    if (isProductInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage || "/placeholder.svg",
        category: product.category,
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Product link copied to clipboard!")
    }
  }

  const productImages = Array.isArray(product?.image)
    ? product.image
    : [product?.image || "/placeholder.svg?height=600&width=600"]
  const currentImage = productImages[selectedImageIndex] || productImages[0]

  const getDisplayPrice = () => {
    if (!product) return 0
    return product.onSale && product.salePrice ? product.salePrice : product.price
  }

  const getOriginalPrice = () => {
    if (!product || !product.onSale || !product.salePrice) return null
    return product.price
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Product not found</p>
          <Button onClick={() => router.push("/products")} className="mt-4">
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 border">
            <Image src={currentImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>

          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-gray-50 border-2 cursor-pointer transition-all ${
                    selectedImageIndex === i ? "border-black" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.onSale && (
                <Badge variant="secondary" className="bg-red-600 text-white text-xs font-medium px-2 py-1">
                  SALE
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">${getDisplayPrice().toFixed(2)}</span>
              {getOriginalPrice() && (
                <span className="text-lg text-gray-500 line-through">was ${getOriginalPrice()!.toFixed(2)}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 capitalize mt-1">{product.category}</p>
            {product.brand && <p className="text-sm text-gray-500 mt-1">by {product.brand}</p>}
          </div>

          {/* Stock Status */}
          {product.countInStock !== undefined && (
            <div>
              <p className={`text-sm ${product.countInStock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of stock"}
              </p>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={product.countInStock !== undefined && quantity >= product.countInStock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-gray-800 text-white py-3"
              size="lg"
              disabled={product.countInStock === 0}
            >
              {product.countInStock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="w-full border-black text-black hover:bg-gray-50 py-3"
              size="lg"
              disabled={product.countInStock === 0}
            >
              BUY NOW
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className={`flex-1 py-3 ${isProductInWishlist ? "border-red-500 text-red-500 hover:bg-red-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isProductInWishlist ? "fill-red-500" : ""}`} />
                {isProductInWishlist ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 py-3"
              >
                <Share2 className="w-4 h-4 mr-2" />
                SHARE
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <div className="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" />
              <span>Secure payment guaranteed</span>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}