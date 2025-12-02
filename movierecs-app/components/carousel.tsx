

//Takes a list of movies and displays them in a horizontal carousel
import React from 'react';
import { Movie, MovieSearchResultsResponse } from '@/types/tmdb-types';
import Image from 'next/image';
import { FetchTMDB } from '@/actions/query';

type CarouselItemsProps = {
  title?: string;
  movies?: Movie[];
};

type SliderState = {
    content: Movie[];
    pages: number;
    currentPage: number;
    maxPage: number;
    tileCountPerPage: number;
    isAnimating: boolean;
};

type SliderActions = {
    setCurrentPage: (currentPage: number) => void;
    setIsAnimating: (isAnimating: boolean) => void;
}

const CarouselItems = ({ title, movies }) => {



};

export default CarouselItems;

