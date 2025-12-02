"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function Search_bar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(query)}`)
    }
  }

  return(
    <div className="bg-gray-900 text-white py-4 z-100">
      {/* Header container */}
    <div className="container mx-auto px-4 flex justify-between items-center">
     <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Search
          </button>
        </form></div></div>
  )
}
