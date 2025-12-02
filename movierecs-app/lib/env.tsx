  
  // processing .env variables
  export const env = 
  {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV as 'development' | 'production',
    TMDB_API_KEY: process.env.TMDB_API_KEY as string,
    TMDB_READ_ACCESS_TOKEN: process.env.TMDB_READ_ACCESS_TOKEN as string,
}