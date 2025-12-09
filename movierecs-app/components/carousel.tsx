
'use client';
//Takes a list of movies and displays them in a horizontal carousel
import React from 'react';
import { ExternalQueryResponse, Movie, MovieSearchResultsResponse } from '@/types/tmdb-types';
import Image from 'next/image';
import { FetchTMDB } from '@/actions/query';
import { ExpandableCard } from './ui/expandable-card';
import { rate, getUserRating, getLoggedInUser } from "@/actions/db"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";

type CarouselItemsProps = {
  title?: string;
  movies: MovieSearchResultsResponse['results'];
};



const CarouselItems = ({ title, movies}: CarouselItemsProps) => {

      const [myRating, setMyRating] = useState<number | null>(null);
      const router = useRouter()

    
      async function handleRate(v: number, movie: Movie){
        const user = await getLoggedInUser()
        if (!user){
          router.push(`/signup?redirect=${encodeURIComponent(`/search?query=${movie.title}`)}`);
          return
        }
        await rate(v, movie);
        setMyRating(v);
      }

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
  }

  const cleanedMovies = cleanAndSortMovies(movies)
        for(var movie of cleanedMovies){
        if (movie != null) {
        useEffect(() => {
            async function load() {
            const r = await getUserRating(movie.id);
            if (r) setMyRating(r.rating);
            }
            load();
        }, [movie.id]);}}

    return(
        <div><h2 className="carousel-header mt-4 text-2xl font-bold">{title}</h2>
        <div className="carousel rounded-box align-items align-content">
            {cleanedMovies.map((movie) => (
                <div className="carousel-item" key={movie.id}>
                <ExpandableCard title={movie.title} src={TMDB_IMAGE_BASE + movie.poster_path} description={movie.release_date}>
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Rate This Movie:
                        <div className="flex flex-wrap gap-2 mt-2">
                            {[1,2,3,4,5,6,7,8,9,10].map((v) => (
                            <button
                                key={v}
                                onClick={() => handleRate(v, movie)}
                                className={`
                                px-1 w-5.2 py-0.5 rounded border text-center
                                ${myRating === v 
                                    ? "bg-yellow-400 text-black border-yellow-500" 
                                    : "bg-gray-600 text-white"
                                }
                                `}
                            >
                                {v}
                            </button>
                            ))}
                        </div>
                        </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Rated <span className="font-bold text-sm dark:text-yellow-300">{Number(movie.vote_average?.toPrecision(2))*10} %</span> by users</p>
                        <p>Total Times Rated: {movie.vote_count}</p>
                        <p>Release Date: {movie.release_date}</p>
                    </div>
                    {movie.overview}</ExpandableCard>
                </div>
            ))}
        </div>
        </div>
    )


};

export default CarouselItems;

