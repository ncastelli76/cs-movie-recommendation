import Image from "next/image";
import { FetchTMDB } from '@/actions/query';
import { Movie, MovieSearchResultsResponse, FetchTMDBParams} from '@/types/tmdb-types';
import Search_bar from "./search_bar";
import CarouselItems from "@/components/carousel";



type HomePageParams = Array<FetchTMDBParams & { label: string }>;

const HomePage = async () => {
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
    //TODO:if logged in, show personalized recommendations instead of popular movies
    homepageParams.map(async params => {
        const { results } = await FetchTMDB(MovieSearchResultsResponse, { ...params });
        return { ...params, results };
    })
  );

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
                      <h2 className="mb-4 text-2xl font-bold">A movie recommendation client</h2>
                  </div>
                  <div className="search"></div>
              </div>
              </div>
          </div>
        </section>
        <section className="inner_content px-32 z-20">
        <CarouselItems title = {homepageContent[0].label} movies={homepageContent[0].results} />
        <CarouselItems title = {homepageContent[1].label} movies={homepageContent[1].results} />
        </section>

        <section className="inner-content w-full h-[70px] bg-gradient-to-t from:zinc-50 dark:from-zinc-950 to-transparent"></section>
        <section className="inner_content w-full py-20 trending px-36 bg-zinc-50 dark:bg-zinc-950"><h2>This section will have an explanation of the purpose of the site.</h2></section>
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="footer h-[70px] bg-gradient-to-t from:zinc-50 dark:from-zinc-950 to-transparent"></div>
      </div>
    </div>
  );


}

export default HomePage;