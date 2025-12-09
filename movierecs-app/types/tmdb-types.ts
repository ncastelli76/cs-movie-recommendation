import {z} from 'zod';

const GenreObject = z.object({
  id: z.number(),
  name: z.string()
})

export const MovieSearchResponse = z.object({
    id: z.number(),                                     // Yes
    overview: z.string().nullable(),                    //
    popularity: z.number(),                             // Yes
    poster_path: z.string().nullable(),                 //
    backdrop_path: z.string().nullable(),               //
    release_date: z.string(),                           //
    title: z.string(),                                  //
    original_title: z.string().nullable(),              // 
    vote_average: z.number().nullable(),                // Yes
    vote_count: z.number().nullable(),                  // Yes
    genres: z.array(GenreObject).nullable(),
});

export const Movie = z.object({
    id: z.number(),                                     // Yes         // Yes 
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

export const ExternalQueryResponse = z.object({
    id: z.number(),
    imdb_id: z.string(),
    wikidata_id: z.string().nullable(),
    facebook_id: z.string().nullable(),
    instagram_id: z.string().nullable(),
    twitter_id: z.string().nullable(),
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
  'keywords',
  'external_ids',
  'movie_id'
] as const);

export type HomePageParams = Array<FetchTMDBParams & { label: string }>;



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

export type ExternalQuery = {
  method: typeof Category.enum.external_ids;
  movie_id: number;
}

export type IDQuery = {
  method: typeof Category.enum.movie_id;
  movie_id: number;
}

export type KeywordQuery= {
  movie_id: number;
  method: typeof Category.enum.keywords;
}

export type ExternalQueryResponse = z.infer<typeof ExternalQueryResponse>;

export type MovieSearchResultsResponse = z.infer<typeof MovieSearchResultsResponse>
export type Movie = z.infer<typeof Movie | typeof MovieSearchResponse>;
export type Genre = z.infer<typeof Genre>;


export type MovieIDParams = Array<FetchTMDBParams>;


export type FetchTMDBParams = SearchQuery 
| PopularQuery 
| TrendingQuery 
| ExternalQuery
| KeywordQuery
| IDQuery; //todo: add types as needed