'use client';

import Link from "next/link";
import { useAuth } from "@/lib/context/auth";
import NotificationBell from "./NotificationBell";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between py-4 border-b mb-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          ChefConnect
        </Link>
        <nav className="hidden gap-4 text-sm md:flex">
          <Link href="/discover" className="hover:text-rose-600 transition">Discover</Link>
          <Link href="/book" className="hover:text-rose-600 transition">Book</Link>
          {user && (
            <Link href="/dashboard" className="hover:text-rose-600 transition">Dashboard</Link>
          )}
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <NotificationBell />
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium">{user.email}</div>
              </div>
              <Link
                href="/profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold"
              >
                {user.email?.[0].toUpperCase()}
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link 
              href="/auth/login" 
              className="text-sm hover:text-rose-600 transition"
            >
              Sign in
            </Link>
            <Link 
              href="/auth/register" 
              className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition"
            >
              Get Started
            </Link>
          </>
        )}
        
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded p-2 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 border-b bg-white p-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/discover" className="hover:text-rose-600 transition" onClick={() => setMobileMenuOpen(false)}>
              Discover
            </Link>
            <Link href="/book" className="hover:text-rose-600 transition" onClick={() => setMobileMenuOpen(false)}>
              Book
            </Link>
            {user && (
              <Link href="/dashboard" className="hover:text-rose-600 transition" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
