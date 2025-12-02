import Image from "next/image";

export default async function SearchResults({
  searchParams
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const params = await searchParams;
  const query  = params.query ?? "";

  type Movie = {
    id: number;
    genre_ids: number[];
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    vote_average: number;
    vote_count: number;
  };

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

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTE2YTAxMTc4YzU2NWRjNGZkNGRlM2NjNTI3NTc2NyIsIm5iZiI6MTc2MTc2NTg5OC40NDQsInN1YiI6IjY5MDI2YTBhZjcwOWE1OTRiNWVlN2E3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RarF4iMCJpwv3pZoJpSAdvyhrgtMWsTP597vf-_jM-A'
    }
  };

  const res = await fetch(url, options);
  if (!res.ok){
    console.error("An error occurred.")
  }
  
  const data = await res.json()
  const movies = mapTmdbMovies(data.results)
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
