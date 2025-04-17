import {useNavigate } from "react-router-dom";

interface Prop {
  imglink?: string;
  color?: string;
  fontColor?: string;
}

export default function Footer({
  imglink = "",
  color = "",
  fontColor = "text-black",
}: Prop) {
  const navigate = useNavigate();
  return (
    <footer
      className={`${color} ${fontColor} bg-cover pt-10 bg-center bg-no-repeat`}
      style={{ backgroundImage: `url('${imglink}')` }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row flex-wrap justify-between gap-8">
        {/* About Us Section */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="text-xl md:text-2xl mb-2">About</h3>
          <p className="text-xs md:text-sm">
            <a className="cursor-pointer hover:text-gray-500" href="#">TECH TACK USED?</a>
            <p>
              An aspiring engineer striving to innovate, solve real-world
              problems, and shape a better technological future.
            </p>
          </p>
        </div>

        {/* Newsletter Section */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="text-xl md:text-2xl mb-2">FEEDBACK</h3>
          <p className="text-xs md:text-sm mb-2">
            Show us your love and feedback, it matters a lot to me.
            <br />
            help me buy a coffee
          </p>
          <form className="flex flex-col sm:flex-row">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-2 sm:w-2/4 rounded-full text-xl hover:bg-blue-700"
              onClick={() => {
                navigate("/chat");
              }}
            >
              Contact
            </button>
          </form>
        </div>

        {/* Social Media Section */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="text-xl md:text-2xl mb-2">Follow Us</h3>
          <div className="flex flex-wrap gap-4 text-xs md:text-sm">
            <a href="#" className="hover:text-gray-500 transition-colors">
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/mrityunjay-jha-7b0436303/"
              className="hover:text-gray-500 transition-colors"
            >
              LinkedIn
            </a>
            <a href="#" className="hover:text-gray-500 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-300 mt-6 py-4">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-[10px] md:text-xs text-gray-600">
            &copy; {new Date().getFullYear()} RELOAD.
          </p>
        </div>
      </div>
    </footer>
  );
}
