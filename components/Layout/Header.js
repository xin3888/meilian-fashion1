import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-600">
            魅恋奇趣
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition">
              首页
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-pink-600 transition">
              所有产品
            </Link>
            <Link href="/new-arrivals" className="text-gray-700 hover:text-pink-600 transition">
              新品上市
            </Link>
            <Link href="/sale" className="text-gray-700 hover:text-pink-600 transition">
              特价优惠
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition">
              关于我们
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <Link href="/" className="block py-2 text-gray-700 hover:text-pink-600">
              首页
            </Link>
            <Link href="/products" className="block py-2 text-gray-700 hover:text-pink-600">
              所有产品
            </Link>
            <Link href="/new-arrivals" className="block py-2 text-gray-700 hover:text-pink-600">
              新品上市
            </Link>
            <Link href="/sale" className="block py-2 text-gray-700 hover:text-pink-600">
              特价优惠
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-pink-600">
              关于我们
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;