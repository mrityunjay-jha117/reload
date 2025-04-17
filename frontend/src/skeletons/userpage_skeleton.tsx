import Header from "../components/primary_components/dashboard/header";
export default function HimeSkeleton() {
  return (
    <>
      <Header />

      {/* Main Section */}
      <main className="p-10 mt-[80px] mx-auto flex flex-col xl:flex-row gap-10">
        <section className="xl:w-1/3 flex flex-col items-center ">
          <div className="shiny-bg lg:text-9xl w-[450px] h-[100px] rounded-xl" />
        </section>

        <section className="relative xl:w-1/2 max-w-4xl h-full mx-auto flex flex-col text-center xl:text-left justify-center items-center">
          <h2 className="text-7xl font-bold mb-6 shiny-text">Loading</h2>
        </section>
      </main>

      {/* Stats Section */}
      <div className="flex flex-col w-5/6 mt-10 mx-auto shiny-bg h-[200px] rounded-xl">
        <div className="flex justify-around items-center h-full" />
      </div>

      <hr className="mx-auto w-5/6 my-10 border-0 h-10 shiny-bg rounded-full" />

      {/* Blog Cards Placeholder */}
      <div className="flex flex-wrap gap-6 my-20 justify-center">
        <div className="h-[300px] w-5/6 rounded-4xl shiny-bg shadow-xl" />
      </div>
    </>
  );
}
