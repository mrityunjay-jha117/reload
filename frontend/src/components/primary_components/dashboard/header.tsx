import Sidebar from "./sidebar";
import Tags from "../primary_components/common_html_components/list_tags";

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#0f0e0e] h-[40px] lg:h-[50px] text-white p-4 shadow-md z-50 transition-all duration-500">
      {/* <div className="flex justify-between space-x-4">
        <Sidebar />
        <nav className=" mr-10">
          <ul className="flex py-3 space-x-20">
            <li className="transform transition duration-300 ease-in-out hover:scale-110">
              <Tags link="blog_page" name="BLOGS" />
            </li>
            <li className="transform transition duration-300 ease-in-out hover:scale-110">
              <Tags link="user" name="MY PAGE" />
            </li>
          </ul>
        </nav>
      </div> */}
    </header>
  );
}
export default Header;
