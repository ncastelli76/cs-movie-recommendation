'use client'
import Link from 'next/link';
import { getLoggedInUser, logOut } from "@/actions/db";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function UserMenuItem() {
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const user = await getLoggedInUser();
        setUsername(user);
      } catch {
        setUsername(null);
      }
    }
    load();
  }, [pathname]);

  async function handleLogout() {
    await logOut()
    setUsername(null)
    router.push("/")
  }

  if (!username) return (
    <li>
      <Link href="/signup" className="hover:text-gray-300">
        Login/Signup
      </Link>
    </li>
  )
  return (
    <li>
      <button
        onClick={handleLogout}
        className="hover:text-gray-300"
      >
        {username} (Logout)
      </button>
    </li>
  );
}

export default function Header() {
  return (
    <header className="bg-neutral-900 text-white py-4 sticky top-0 z-50">
      {/* Header container */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Website title */}
        <Link href="/" className="font-bold">
          EpicMovieRecommender
        </Link>
        {/* Navigation menu */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6">
            {/* Navigation links */}
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/search?query=Avengers" className="hover:text-gray-300">
                Avengers (examples)
              </Link>
            </li>
            <li>
              <Link href="/search?query=The%20Godfather" className="hover:text-gray-300">
                The Godfather (examples)
              </Link>
            </li>
            <li>
              <Link href="/search?query=The%20Notebook" className="hover:text-gray-300">
                The Notebook (examples)
              </Link>
            </li>
            <UserMenuItem />
          </ul>
        </nav>
        {/* Add Mobile Navigation Toggle Here */}
      </div>
    </header>
  );
}
