'use client'
import Link from 'next/link';
import { getLoggedInUser, logOut } from "@/actions/db";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

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
    router.push("/signup")
    await logOut()
    setUsername(null)
    router.push("/")
  }

  if (!username) return (
    <li>
      <button onClick={() => router.push('/signup')}
      type = "button" className = "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-1 px-4 rounded">
        Login/Signup
      </button>
    </li>
  )
  return (
    <li>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-1 px-4 rounded"
      >
        {username} (Logout)
      </button>
    </li>
  );
}

export default function Header() {
  return (
    <header className="bg-zinc-900 text-white py-4 sticky top-0 z-50">
      {/* Header container */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex align-items items-left">
        <Image src="/popcorn.svg" alt="Logo" width={30} height={30} />
        {/* Website title */}
        <Link href="/" className="font-bold px-2 text-2xl">
          EMovieRecs
        </Link>
        </div>
        {/* Navigation menu */}
        <nav className="hidden md:block justify-between items-right">
          <ul className="flex gap-x-6">
            {/* Navigation links */}
            <li>
              <Link href="/" className="hover:text-gray-300 py-1">
                Home
              </Link>
            </li>
            <li>
              <Link href="/search?query=Avengers" className="hover:text-gray-300 py-1">
                Avengers (examples)
              </Link>
            </li>
            <li>
              <Link href="/search?query=The%20Godfather" className="hover:text-gray-300 py-1">
                The Godfather (examples)
              </Link>
            </li>
            <li>
              <Link href="/search?query=The%20Notebook" className="hover:text-gray-300 py-1">
                The Notebook (examples)
              </Link>
            </li>
            <li>
              <Link href="https://sites.google.com/view/information-retrieval-hybrid/home" className="hover:text-gray-300 py-1">
                About the project...
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
