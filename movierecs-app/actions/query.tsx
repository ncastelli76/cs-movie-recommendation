'use server';

import { env } from '@/lib/env';

const { TMDB_READ_ACCESS_TOKEN } = env;
import { FetchTMDBParams } from '@/types/tmdb-types';

const BASE_URL = 'https://api.themoviedb.org/3';

const createUrl = (params: FetchTMDBParams) => {
    switch (params.method) {
        case 'search':
            const url = new URL(`${BASE_URL}/${params.method}/movie`);
            url.searchParams.append('query', params.q);
            url.searchParams.append('include_adult', 'false');
            url.searchParams.append('language', 'en-US');
            url.searchParams.append('page', '1');
            return url.href;
        default:
            throw new Error(`Unknown method: ${params.method}`);
    }
}

export const fetchTMDB = async (params: FetchTMDBParams) => {
    const url = createUrl(params);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
        }
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`TMDB API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}


