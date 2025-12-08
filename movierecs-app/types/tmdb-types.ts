import {z} from 'zod';

const Movie = z.object({
    id: z.number(),                                     // Yes
    genre_ids: z.array(z.number()).nullable(),          // Yes 
    overview: z.string().nullable(),                    //
    popularity: z.number(),                             // Yes
    poster_path: z.string().nullable(),                 //
    backdrop_path: z.string().nullable(),               //
    release_date: z.string(),                           //
    title: z.string(),                                  //
    original_title: z.string().nullable(),              // 
    vote_average: z.number().nullable(),                // Yes
    vote_count: z.number().nullable(),                  // Yes
  });

export const MovieSearchResultsResponse = z.object({
    page: z.number(),
    total_pages: z.number(),
    total_results: z.number(),
    results: z.array(Movie),
  });

export type Keyword = {
    id: number;
    name: string;
  };

export type MovieKeywords = {
    id: number;
    results: Keyword[];
};

export const Genre = z.enum([
  'action',
  'adventure',
  'animation',
  'comedy',
  'crime',
  'documentary',
  'drama',
  'family',
  'fantasy',
  'history',
  'horror',
  'music',
  'mystery',
  'romance',
  'science-fiction',
  'tv-movie',
  'thriller',
  'war',
  'western',
] as const);

export const MOVIE_GENRES = {
  28: Genre.enum.action,
  12: Genre.enum.adventure,
  16: Genre.enum.animation,
  35: Genre.enum.comedy,
  80: Genre.enum.crime,
  99: Genre.enum.documentary,
  18: Genre.enum.drama,
  10751: Genre.enum.family,
  14: Genre.enum.fantasy,
  36: Genre.enum.history,
  27: Genre.enum.horror,
  10402: Genre.enum.music,
  9648: Genre.enum.mystery,
  10749: Genre.enum.romance,
  878: Genre.enum['science-fiction'],
  10770: Genre.enum['tv-movie'],
  53: Genre.enum.thriller,
  10752: Genre.enum.war,
  37: Genre.enum.western,
} as const;

const Category = z.enum([
  'search',
  'popular',
  'trending',
] as const);



export type SearchQuery = {
  method: typeof Category.enum.search;
  q: string;
};

export type PopularQuery = {
  method: typeof Category.enum.popular;
};
export type TrendingQuery = {
  method: typeof Category.enum.trending;
};

export type MovieSearchResultsResponse = z.infer<typeof MovieSearchResultsResponse>
export type Movie = z.infer<typeof Movie>;
export type Genre = z.infer<typeof Genre>;

export type FetchTMDBParams = SearchQuery | PopularQuery | TrendingQuery; //todo: add types as needed