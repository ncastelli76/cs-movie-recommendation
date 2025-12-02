import Image from "next/image";
import { FetchTMDB } from '@/actions/query';
import { MovieSearchResultsResponse, FetchTMDBParams} from '@/types/tmdb-types';
import Search_bar from "./search_bar";



type HomePageParams = Array<FetchTMDBParams & { label: string }>;

const HomePage = async () => {
  const homepageParams: HomePageParams = [
    {
      label: 'Popular Movies',
      method: 'popular'
    }
  ];

  /*const homepageContent = await Promise.all(
    homepageParams.map(async params => {
        const { results } = await FetchTMDB(MovieSearchResultsResponse, { ...params });
        return { ...params, results };
    })
  );

  const filteredContent = homepageContent.filter(
    (content): content is NonNullable<typeof content> => content !== undefined
  );*/

  return (
    <div>
      <div className="fixed top-14 left-0 right-0">
      <Search_bar />
      </div>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans dark:bg-neutral-800">
        <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between py-32 px-5 bg-slate-50 dark:bg-neutral-800 sm:items-start">
        <section className= "inner_content py-20 new_index background_11">
          <div id="media_v4" className="media discover">
              <div className="column_wrapper">
              <div className="content_wrapper wrap">
                  <div className="title">
                      <h1>This is the main page.</h1>
                      <h2>This section will handle the search engine.</h2>
                  </div>
                  <div className="search"></div>
              </div>
              </div>
          </div>
        </section>
        <section className="inner_content py-20 trending"> <h2>This section will handle the carousel.</h2>

        </section>

        <section className="inner_content py-20 trending no_pad"><h2>This section will have an explanation of the purpose of the site.</h2></section>
        </main>
      </div>
    </div>
  );


}

export default HomePage;