"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, X, Search, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { useWishlist } from "../context/wishlist-context"
import { useCart } from "../context/cart-context"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { state: cartState } = useCart()
  const { state: authState, logout } = useAuth()
  const { state: wishlistState } = useWishlist()
  const wishlistCount = wishlistState.items.length

  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const handleGenderFilter = (gender: string) => {
    router.push(`/products?gender=${gender}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const query = formData.get("search") as string
    if (query?.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(query.trim())}`)
      setIsMenuOpen(false)
    }
  }

  const navigationItems = [
    { name: "New & Featured", href: "/products?category=new" },
    { name: "Women", action: () => handleGenderFilter("Women") },
    { name: "Men", action: () => handleGenderFilter("Men") },
    { name: "Collections", href: "/products" },
    { name: "Sale", href: "/products?onSale=true" },
  ]

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm font-medium">FREE SHIPPING ON ORDERS OVER $75</div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-black tracking-wider">STYLEHUB</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-gray-900 hover:text-gray-600 transition-colors font-medium text-sm uppercase tracking-wide"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className="text-gray-900 hover:text-gray-600 transition-colors font-medium text-sm uppercase tracking-wide"
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 border-gray-300 focus:border-black"
                      autoFocus
                    />
                    <Button type="submit" variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* User Profile/Auth */}
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{authState.user?.name}</p>
                        <p className="text-xs text-gray-500">{authState.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    {authState.user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleMobileSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    type="search" 
                    name="search"
                    placeholder="Search products..." 
                    className="pl-10 pr-4 py-2 w-full" 
                  />
                </form>

                {/* Mobile Menu Items */}
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-gray-900 hover:text-gray-600 py-2 block font-medium text-sm uppercase tracking-wide"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.action?.()
                          setIsMenuOpen(false)
                        }}
                        className="text-gray-900 hover:text-gray-600 py-2 block font-medium text-sm uppercase tracking-wide w-full text-left"
                      >
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}

                {/* Mobile Auth */}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  {authState.isAuthenticated ? (
                    <>
                      <div className="text-sm font-medium text-gray-900">{authState.user?.name}</div>
                      <Link
                        href="/profile"
                        className="text-gray-700 hover:text-gray-900 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="text-gray-700 hover:text-gray-900 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {authState.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="text-gray-700 hover:text-gray-900 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="justify-start text-red-600 hover:text-red-700 p-0"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="flex space-x-2">
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                        <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}