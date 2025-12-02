import {z} from 'zod';


export type Movie = {
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

export type MovieSearchResultsResponse = {
    page: number;
    total_pages: number;
    total_results: number;
    results: Movie[];
  };

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
] as const);


export type SearchQuery = {
  method: typeof Category.enum.search;
  q: string;
};

export type FetchTMDBParams = SearchQuery; //todo: add types as needed




