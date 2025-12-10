import Image from "next/image";
import { FetchTMDB } from '@/actions/query';
import { Movie, MovieSearchResultsResponse, FetchTMDBParams, MovieIDParams, HomePageParams} from '@/types/tmdb-types';
import Search_bar from "./search_bar";
import CarouselItems from "@/components/carousel";
import { getLoggedInUser,findMovies} from "@/actions/db";


var username
export async function CarouselParams() {
    try{
        const user = await getLoggedInUser()
        username = user
    }
    catch{
        username = null
    }
    if(!username){
    const homepageParams: HomePageParams = [
        {
      label: 'Popular Movies',
      method: 'popular'
    },
    {
      label: 'Trending Today',
      method: 'trending'
    },
  ];
  const homepageContent = await Promise.all(
    homepageParams.map(async params => {
        const { results } = await FetchTMDB(MovieSearchResultsResponse, { ...params });
        return { ...params, results };
    })
  );
  return(
        <section className="inner_content px-32 z-20">
        <CarouselItems title = {homepageContent[0].label} movies={homepageContent[0].results} />
        <div className="hr solid my-8"/>
        <CarouselItems title = {homepageContent[1].label} movies={homepageContent[1].results} />
        <div className="hr solid my-8"/>
        </section>
  )
    }
    else{
    //TODO:if logged in, show personalized recommendations instead of popular movies
    const movieIDs: number[] = [
        533533, 
        1084242, 
        1083637]; //THIS IS A TOY LIST OF IDS FOR EXAMPLE PURPOSES

    const recommendedContent = await Promise.all(
        movieIDs.map(async id => {
            const output = await FetchTMDB(Movie, {method: 'movie_id', movie_id: id})
            return output;
        })
    );
    
    let listIds= await findMovies()
    console.log(listIds)
    let flag=listIds.pop() - 1
    let flag1=(flag*2)+1
    let flag2=(flag*2+1)+1


    const similarMovies = await Promise.all(
      listIds.map(async id =>{
        const output = await FetchTMDB(Movie, {method: 'movie_id', movie_id: id})
        return output;} )

    );

      return(
        <section className="inner_content px-32 z-20">
        <CarouselItems title = {"Recommended for you"} movies={recommendedContent} />
        <div className="hr solid my-8"/>
        <CarouselItems title = {'You might watch this\n Hate watch movies:'+String(flag1) + 'and '+String(flag2)} movies={similarMovies} />
        <div className="hr solid my-8"/>
        </section>
  )

    }
}


const HomePage = async () => {

    
  return (
    <div>
      <div className="fixed top-14 left-0 right-0 z-50">
      <Search_bar />
      </div>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans dark:bg-neutral-800">
        <main className="flex min-h-screen w-full flex-col items-center justify-between py-0 px-0 bg-slate-50 dark:bg-neutral-800 sm:items-start">
        <section className= "inner_content py-20 px-32 new_index w-full background_11">
          <div id="media_v4" className="media discover">
              <div className="column_wrapper">
              <div className="content_wrapper wrap">
                  <div className="title p-20">
                      <h1 className="mb-4 text-4xl font-bold">EMovieRecs</h1>
                      <h2 className="mb-4 text-2xl font-bold">A movie recommendation software</h2>
                  </div>
                  <div className="search"></div>
              </div>
              </div>
          </div>
        </section>
        <CarouselParams />
        <section className="inner_content w-full py-5 mb-20 trending px-36 bg-slate-50 dark:bg-neutral-800">
          <div className="flex h-10 items-center gap-2"><span className="font-light text-primary/70 text-sm">Made with</span><a href="https://nextjs.org/" target="_blank" rel="noreferrer"><Image src="/next.svg" alt="Next.JS" width="100" height="0"/></a></div>
          <div className="flex h-10 items-center gap-2"><span className="font-light text-primary/70 text-sm">Data provided by</span><a href="https://developer.themoviedb.org/docs/getting-started" target="_blank" rel="noreferrer"><Image alt="The Movie Database Logo" width="100" height="0" src="/tmdb-logo.svg" /></a></div>
        </section>
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="footer h-[70px] bg-gradient-to-t from:zinc-50 dark:from-zinc-950 to-transparent"></div>
      </div>
    </div>
  );}

  export default HomePage