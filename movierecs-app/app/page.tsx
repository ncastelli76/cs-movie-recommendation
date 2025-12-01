import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <section className= "inner_content bg-grey-100 new_index background_11">
        <div id="media_v4" className="media discover">
            <div className="column_wrapper">
            <div className="content_wrapper wrap">
                <div className="title">
                    <h1>Welcome.</h1>
                    <h2>This section will handle the search engine.</h2>
                </div>
                <div className="search"></div>
            </div>
            </div>
        </div>
      </section>
      <section className="inner_content trending no_pad"><h2>This section will have a recommendation carousel.</h2></section>

      <section className="inner_content trending no_pad"><h2>This section will have an explanation of the purpose of the site.</h2></section>
      </main>
    </div>
  );
}
