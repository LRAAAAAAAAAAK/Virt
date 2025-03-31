import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary p-10 text-center">
      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-secondary font-poppins">
          404
        </h1>
        <h2 className="text-4xl font-semibold text-white font-poppins">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-300 font-inter max-w-lg mx-auto">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link href="/" className="inline-block px-8 py-3 rounded-md bg-secondary text-primary font-semibold font-poppins hover:bg-yellow-400 transition-colors duration-200 text-lg">
          Return Home
        </Link>
      </div>
    </main>
  )
} 