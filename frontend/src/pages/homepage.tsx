import Banner from "../components/primary_components/primary_components/unique_components/Banner";
import Header from "../components/primary_components/dashboard/header";
import Footer from "../components/primary_components/dashboard/footer";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/primary_components/primary_components/slider/carousel";
import BlogCard from "../components/primary_components/primary_components/cards/blog_card";
export default function Home() {
  const navigate = useNavigate();
  const images = [
    {
      image: "/images/carousel_images/1.jpg",
      title: "Sunset Over the Hills",
      description:
        "A breathtaking view of the sun setting behind rolling hills.",
    },
    {
      image: "/images/carousel_images/2.jpg",
      title: "Majestic Waterfall",
      description: "A powerful waterfall cascading down rocky cliffs.",
    },
    {
      image: "/images/carousel_images/3.jpg",
      title: "Serene Lake",
      description:
        "A calm lake reflecting the beauty of the surrounding mountains.",
    },
    {
      image: "/images/carousel_images/4.jpg",
      title: "Autumn Forest",
      description:
        "Golden leaves covering the ground in a dense autumn forest.",
    },
    {
      image: "/images/carousel_images/5.jpg",
      title: "Snowy Peaks",
      description: "Towering mountains covered in a blanket of white snow.",
    },
    {
      image: "/images/carousel_images/6.jpg",
      title: "Desert Dunes",
      description:
        "Waves of sand stretching into the horizon under a clear sky.",
    },
    {
      image: "/images/carousel_images/7.jpg",
      title: "Rocky Coastline",
      description: "Waves crashing against rugged coastal cliffs.",
    },
    {
      image: "/images/carousel_images/8.jpg",
      title: "Flower Meadow",
      description: "A colorful field of wildflowers blooming under the sun.",
    },
    {
      image: "/images/carousel_images/9.jpg",
      title: "Foggy Valley",
      description: "A mysterious valley covered in a thick morning mist.",
    },
    {
      image: "/images/carousel_images/10.jpg",
      title: "Starry Night Sky",
      description: "A mesmerizing view of the Milky Way shining brightly.",
    },
  ];

  return (
    <div>
      <Header />
      <div>
        <div className="mt-[40px] lg:mt-[50px] h-[200px] xl:h-[350px] w-full">
          <Banner />
        </div>

        <section className="bg-gradient-to-b from-[#210002] to-[#3e3232] text-white">
          <header className="flex flex-col text-center gap-5  pt-8">
            <h1 className="text-5xl font-bold text-red-500">
              NIR
              <span className="text-white">V</span>ANA
            </h1>
            <p className="text-xs text-white w-11/12  mx-auto ">
              Every location we explore is a path toward discovering your inner
              peace and joy, akin to the spiritual enlightenment sought by those
              who pursue Nirvana. Whether you’re seeking solitude in the
              mountains, peace by the sea, or moments of stillness amidst
              ancient ruins, these destinations provide an escape from the noise
              of everyday life We believe every traveler is a storyteller, and
              every trip has a tale worth sharing.
              <br />
              <span className="italic text-md text-gray-300 block mt-2">
                "Brave are those who don't just visit the world, but let it
                change them."
              </span>
            </p>
          </header>

          <section className="p-3 mt-10 h-[200px] md:h-[300px] mx-auto ">
            <Carousel images={images} />
          </section>

          <section className="w-full mx-auto p-5 gap-5 xl:gap-1 flex sm:flex-row flex-col  justify-around">
            <div
              className="my-10  cursor-pointer"
              onClick={() => navigate(`/user`)}
            >
              <BlogCard
                image="https://imgs.search.brave.com/V-9d-rX0SK7ml58VT9aJPESqArv0VX7TbYCgRPYTx8M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU5/NzUxNDUyL3Bob3Rv/L2xhbmRzY2FwZS1p/bWFnZS1vZi1sb3dl/ci1hbnRlbG9wZS1j/YW55b24taW4tc3R1/bm5pbmctY29sb3Jz/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz11amVtR2tyanRZ/dUJlZ1BYTWdJQm4y/NXhYLXVyZ2FwaF84/bGRQSFZhRzNNPQ"
                title="MY PAGE"
                description="lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived "
              />
            </div>
            <div
              className="my-10  cursor-pointer"
              onClick={() => navigate(`/blog_page`)}
            >
              <BlogCard
                image="https://imgs.search.brave.com/V-9d-rX0SK7ml58VT9aJPESqArv0VX7TbYCgRPYTx8M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU5/NzUxNDUyL3Bob3Rv/L2xhbmRzY2FwZS1p/bWFnZS1vZi1sb3dl/ci1hbnRlbG9wZS1j/YW55b24taW4tc3R1/bm5pbmctY29sb3Jz/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz11amVtR2tyanRZ/dUJlZ1BYTWdJQm4y/NXhYLXVyZ2FwaF84/bGRQSFZhRzNNPQ"
                title="BLOGS"
                description="lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not"
              />
            </div>
          </section>
          <hr className="border-t-[10px] w-full border-white" />
        </section>
      </div>
      <Footer color="bg-[#3e3232]" fontColor="text-white" />
    </div>
  );
}
