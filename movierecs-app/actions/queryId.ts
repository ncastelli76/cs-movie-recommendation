'use server';

import { Schema } from 'zod';

import { FetchTMDBParams } from '@/types/tmdb-types';

const BASE_URL = 'http://api.themoviedb.org/3';

const createUrl = (params: FetchTMDBParams) => {
    switch (params.method) {
        case 'movie':
          const u = new URL(`${BASE_URL}/movie/${params.movie}`);
          return u.href;
        default:
            throw new Error(`Unknown method`);
    }
}

export const FetchTMDBid = async <T>(
  params: FetchTMDBParams
): Promise<T> => {
  try {
    const url = createUrl(params);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        gzip: true,
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTE2YTAxMTc4YzU2NWRjNGZkNGRlM2NjNTI3NTc2NyIsIm5iZiI6MTc2MTc2NTg5OC40NDQsInN1YiI6IjY5MDI2YTBhZjcwOWE1OTRiNWVlN2E3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RarF4iMCJpwv3pZoJpSAdvyhrgtMWsTP597vf-_jM-A`, //${TMDB_READ_ACCESS_TOKEN}
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} ${response}`);
    }

    const data = await response.json();
    return data;
  } 
  catch (error) {
    console.error(error);
    return 0 as unknown as T;
  }
};


