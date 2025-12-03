import Image from "next/image";

import { FetchTMDB } from '@/actions/query';
import { FetchTMDBParams, Movie, MovieSearchResultsResponse } from '@/types/tmdb-types';
import MovieCard from '@/app/movie_card'
import Search_bar from "../search_bar";

export default async function SearchResults({
  searchParams
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const params = await searchParams;
  const query  = params.query ?? "";
  console.log("sending query to TMDB")
  const results = await FetchTMDB(
    MovieSearchResultsResponse,{
    method: 'search',
    q: query,
  });

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

  const cleanedMovies = cleanAndSortMovies(results.results)

  return (
    <div className="bg-zinc-50 dark:bg-neutral-800 p-8">
      <div className="fixed top-14 left-0 right-0">
          <Search_bar />
        </div>
      <div className="mx-[20%]">   {/* matches your header margins */}
        <h1 className="text-3xl font-bold mb-6 mt-24">
          Search results for "{query}"
        </h1>

        <div className="space-y-6 overflow-y-auto max-h-[80vh]">
          {cleanedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
