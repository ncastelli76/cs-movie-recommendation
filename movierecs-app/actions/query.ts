'use server';

import { env } from '@/lib/env';
import { Schema } from 'zod';

const { TMDB_READ_ACCESS_TOKEN } = env;
import { FetchTMDBParams } from '@/types/tmdb-types';

const BASE_URL = 'https://api.themoviedb.org/3';

const createUrl = (params: FetchTMDBParams) => {
    switch (params.method) {
        case 'popular':
          return `${BASE_URL}/movie/${params.method}?language=en-US&page=1`;
        case 'search':
            const url = new URL(`${BASE_URL}/${params.method}/movie`);
            url.searchParams.append('query', params.q);
            url.searchParams.append('include_adult', 'false');
            url.searchParams.append('language', 'en-US');
            url.searchParams.append('page', '1');
            return url.href;

        default:
            throw new Error(`Unknown method`);
    }
}

export const FetchTMDB = async <T>(
  schema: Schema<T>,
  params: FetchTMDBParams
): Promise<T> => {
  try {
    const url = createUrl(params);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTE2YTAxMTc4YzU2NWRjNGZkNGRlM2NjNTI3NTc2NyIsIm5iZiI6MTc2MTc2NTg5OC40NDQsInN1YiI6IjY5MDI2YTBhZjcwOWE1OTRiNWVlN2E3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RarF4iMCJpwv3pZoJpSAdvyhrgtMWsTP597vf-_jM-A`, //${TMDB_READ_ACCESS_TOKEN}
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} ${response}`);
    }

    const data = await response.json();
    return schema.parse(data);
  } 
  catch (error) {
    console.error(error);
    return 0 as unknown as T;
  }
};


