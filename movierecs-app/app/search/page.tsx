import Image from "next/image";

import { FetchTMDB } from '@/actions/query';
import { FetchTMDBParams, Movie, MovieSearchResultsResponse } from '@/types/tmdb-types';


export default async function SearchResults({
  searchParams
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const params = await searchParams;
  const query  = params.query ?? "";
  const results = await FetchTMDB(
    MovieSearchResultsResponse,{
    method: 'search',
    q: query,
  });
  return {...params, results};

  function cleanAndSortMovies(movies: Movie[]): Movie[] {
    const today = new Date();

    return movies
      .filter((movie) => {
        if (!movie.poster_path) return false;

        const release = new Date(movie.release_date);
        if (isNaN(release.getTime())) return false;
        if (release > today) return false;

        return true;
      })
      .sort((a, b) => b.popularity - a.popularity);
  }

  function rate(id:number, rating:number){
    
  }

  function mapTmdbMovies(rawMovies: any[]): Movie[] {
    return rawMovies.map((raw) => ({
      id: raw.id,
      genre_ids: raw.genre_ids ?? [],
      overview: raw.overview ?? "",
      popularity: raw.popularity ?? 0,
      poster_path: raw.poster_path ?? "",
      release_date: raw.release_date ?? "",
      title: raw.title ?? raw.original_title ?? "",
      vote_average: raw.vote_average ?? 0,
      vote_count: raw.vote_count ?? 0,
    }));
  }
  const movies = mapTmdbMovies(results.results);
  const cleanedMovies = cleanAndSortMovies(movies)

  const TMDB_BASE = "https://image.tmdb.org/t/p/w1280";
  const TMDB_MOVIE_BASE = "https://www.themoviedb.org/movie/"

  return (
    <div className="bg-zinc-50 dark:bg-neutral-800 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Search results for "{query}"
      </h1>
      <div className="space-y-6 overflow-y-auto max-h-[80vh]">
        {cleanedMovies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col md:flex-row bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex-shrink-0 w-full max-w-[13.5rem] md:max-w-[13.5rem] aspect-[27/40] relative">
              <a href={TMDB_MOVIE_BASE + movie.id}>
                <Image
                  src={TMDB_BASE + movie.poster_path}
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
                  <button onClick={() => rate(1, movie.id)} className="px-2 py-1 border rounded">
                    1
                  </button>
                  <button onClick={() => rate(2, movie.id)} className="px-2 py-1 border rounded">
                    2
                  </button>
                  <button onClick={() => rate(3, movie.id)} className="px-2 py-1 border rounded">
                    3
                  </button>
                  <button onClick={() => rate(4, movie.id)} className="px-2 py-1 border rounded">
                    4
                  </button>
                  <button onClick={() => rate(5, movie.id)} className="px-2 py-1 border rounded">
                    5
                  </button>
                  <button onClick={() => rate(6, movie.id)} className="px-2 py-1 border rounded">
                    6
                  </button>
                  <button onClick={() => rate(7, movie.id)} className="px-2 py-1 border rounded">
                    7
                  </button>
                  <button onClick={() => rate(8, movie.id)} className="px-2 py-1 border rounded">
                    8
                  </button>
                  <button onClick={() => rate(9, movie.id)} className="px-2 py-1 border rounded">
                    9
                  </button>
                  <button onClick={() => rate(10, movie.id)} className="px-2 py-1 border rounded">
                    10
                  </button>
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
        ))}
      </div>
    </div>
  );
}
