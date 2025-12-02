import Image from "next/image";
import type { Movie } from "../types/tmdb-types"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";
const TMDB_MOVIE_BASE = "https://www.themoviedb.org/movie/"

function rate(rating: number, id: number) {
  
}

export default function MovieCard({
  movie
}: {
  movie: Movie
}) {
  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0 w-full max-w-[13.5rem] md:max-w-[13.5rem] aspect-[27/40] relative">
        <a href={TMDB_MOVIE_BASE + movie.id}>
          <Image
            src={TMDB_IMAGE_BASE + movie.poster_path}
            alt={movie.title}
            fill
            className="object-cover rounded"
          />
        </a>
      </div>

      <div className="p-4 flex flex-col justify-between">
        <div>
          <a href={TMDB_MOVIE_BASE + movie.id}>
            <h2 className="text-xl font-bold">{movie.title}</h2>
          </a>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{movie.overview}</p>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Rate This Movie:
          <div className="flex flex-wrap gap-2 mt-2">
            {[1,2,3,4,5,6,7,8,9,10].map((v) => (
              <button
                key={v}
                onClick={() => rate(v, movie.id)}
                className="px-2 py-1 border rounded"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Average Rating: {movie.vote_average}
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Total Times Rated: {movie.vote_count}
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Release Date: {movie.release_date}
        </div>
      </div>
    </div>
  );
}
