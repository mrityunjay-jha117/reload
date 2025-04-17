import { useState } from "react";
import sidebaricon from "/drawer.svg";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-[90px]">
      <div className="flex flex-row gap-10 text-white items-center absolute z-50 cursor-pointer pl-5 ">
        <img
          onClick={toggleSidebar}
          src={sidebaricon}
          alt="Toggle Sidebar"
          className="w-6 h-6"
        />
        <img
          src="./../../../../images/icons/user (1).png"
          className="w-10 h-10 "
          alt="ok"
          onClick={() => {
            navigate("/profile");
          }}
        />
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-30 w-50 sm:w-70 lg:w-90 bg-[#0f0e0e] text-white transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex p-2 flex-col mt-40 space-y-25">
          {/* PROFILE */}
          <div
            style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
            className={`cursor-pointer transition-all duration-300 ease-in-out transform flex items-center justify-center w-full h-[60px] text-center rounded-lg p-2 text-lg sm:text-xl text-white border-4 border-transparent hover:text-2xl hover:border-white hover:translate-x-10 ${
              isOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-[-500px] opacity-0"
            }`}
            onClick={() => navigate("/profile")}
          >
            PROFILE
          </div>

          {/* CHAT */}
          <div
            style={{ transitionDelay: isOpen ? "300ms" : "0ms" }}
            className={`cursor-pointer transition-all duration-300 ease-in-out transform flex items-center justify-center w-full h-[60px] text-center rounded-lg p-2 text-lg sm:text-xl text-white border-4 border-transparent hover:text-2xl hover:border-white hover:translate-x-10 ${
              isOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-[-500px] opacity-0"
            }`}
            onClick={() => navigate("/chat")}
          >
            CHAT
          </div>

          {/* ABOUT */}
          <a href="example">
            <div
              style={{ transitionDelay: isOpen ? "450ms" : "0ms" }}
              className={`cursor-pointer transition-all duration-300 ease-in-out transform flex items-center justify-center w-full h-[60px] text-center rounded-lg p-2 text-lg sm:text-xl text-white border-4 border-transparent hover:text-2xl hover:border-white hover:translate-x-10 ${
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[-500px] opacity-0"
              }`}
            >
              ABOUT
            </div>
          </a>
          {/* WHOAMI */}
          <a href="https://www.linkedin.com/in/mrityunjay-jha-7b0436303/">
            <div
              style={{ transitionDelay: isOpen ? "600ms" : "0ms" }}
              className={`cursor-pointer transition-all duration-300 ease-in-out transform flex items-center justify-center w-full h-[60px] text-center rounded-lg p-2 text-lg sm:text-xl text-white border-4 border-transparent hover:text-2xl hover:border-white hover:translate-x-10 ${
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[-500px] opacity-0"
              }`}
            >
              WHO AM I
            </div>
          </a>
          {/* LOGOUT */}
          <div
            style={{ transitionDelay: isOpen ? "750ms" : "0ms" }}
            className={`cursor-pointer transition-all duration-300 ease-in-out transform flex items-center justify-center w-full h-[60px] text-center rounded-lg p-2 text-lg sm:text-xl text-white border-4 border-transparent hover:text-2xl hover:border-white hover:translate-x-10 ${
              isOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-[-500px] opacity-0"
            }`}
            onClick={() => {
              localStorage.removeItem("jwt"); // Remove JWT token from localStorage
              navigate("/"); // Navigate to home
            }}
          >
            LOGOUT
          </div>
        </div>
      </div>
    </div>
  );
}
