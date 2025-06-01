import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-light tracking-wide">StyleHub</h3>
              <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                Premium fashion and style for the modern lifestyle. Discover timeless pieces crafted with exceptional
                quality.
              </p>
            </div>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-medium tracking-wide uppercase">Shop</h4>
            <div className="space-y-3">
              <Link href="/products" className="block text-gray-400 hover:text-white text-sm transition-colors">
                All Products
              </Link>
              <Link
                href="/products?gender=women"
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Women
              </Link>
              <Link
                href="/products?gender=men"
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Men
              </Link>
              <Link
                href="/products?category=new"
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/products?sale=true"
                className="block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sale
              </Link>
            </div>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h4 className="text-sm font-medium tracking-wide uppercase">Customer Care</h4>
            <div className="space-y-3">
              <Link href="/contact" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Contact Us
              </Link>
              <Link href="/shipping" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Returns & Exchanges
              </Link>
              <Link href="/size-guide" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Size Guide
              </Link>
              <Link href="/faq" className="block text-gray-400 hover:text-white text-sm transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-medium tracking-wide uppercase">Stay Connected</h4>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Subscribe for exclusive offers and updates</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                />
                <button className="w-full bg-white text-black py-3 text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">hello@stylehub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} StyleHub. All rights reserved.</p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">
                  VISA
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">
                  MC
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">
                  AMEX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
