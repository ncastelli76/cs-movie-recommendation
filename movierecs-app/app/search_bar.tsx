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
    <div className="search-bar bg-zinc-800 text-white py-4 z-[100] shadow-lg">
  <div className="container mx-auto px-4 flex items-center">
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-3 py-2 rounded-lg bg-zinc-900/50 text-white focus:outline-none focus:ring focus:ring-neutral-600"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg whitespace-nowrap"
      >
        Search
      </button>
    </form>
  </div>
</div>


  )
}


