

import Link from 'next/link';

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
              <Link href="/link1" className="hover:text-gray-300">
                Browse All
              </Link>
            </li>
            <li>
              <Link href="/link2" className="hover:text-gray-300">
                Link2 (optional)
              </Link>
            </li>
            <li>
              <Link href="/link3" className="hover:text-gray-300">
                Link3 (optional)
              </Link>
            </li>
            <li>
              <Link href="/link4" className="hover:text-gray-300">
                Login
              </Link>
            </li>
          </ul>
        </nav>
        {/* Add Mobile Navigation Toggle Here */}
      </div>
    </header>
  );
}
