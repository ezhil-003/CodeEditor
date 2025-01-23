import { useState, useEffect } from "react";
import { Button, Switch } from "@nextui-org/react";
import { Link, useNavigate } from "react-router";
import { MoonIcon } from "../utils/MoonIcon.tsx";
import { SunIcon } from "../utils/SunIcon.tsx";
import { useTheme } from "../../Contexts/ThemeContext.tsx";

export default function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initial mobile state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    // Update `isMobile` on window resize
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);

      if (!isNowMobile) {
        setIsMobileMenuOpen(false); // Close menu when switching to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleOutsideClick = (event: MouseEvent) => {
      const menuElement = document.querySelector(".mobile-menu");
      const toggleButton = document.querySelector(".menu-toggle-button");

      if (
        menuElement &&
        toggleButton &&
        !menuElement.contains(event.target as Node) &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMobileMenuOpen]);

  const menuItems = [
    {
      title: "Profile",
      link: "/"
    },
    {
      title: "Dashboard",
      link: "/"
    },
    {
      title: "Activity",
      link: "/"
    },
    {
      title: "Analytics",
      link: "/"
    }];

  return (
    <nav className="p-4 sticky top-0  dark:bg-gray-900 flex justify-center items-center">
      <div className="container mx-auto flex justify-between items-center w-full">
        <div className="flex items-center mr-5">
          <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
              clipRule="evenodd"
              d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
          <h3 className="font-bold text-2xl text-gray-700 dark:text-white">
            Code Editor
          </h3>{" "}
          {/* Dark mode text color */}
        </div>

        {!isMobile &&
          <div className="flex space-x-4 items-center">
            {menuItems.map((item, idx) =>
              <Link
                key={idx}
                to={item.link}
                className="py-2 px-4 text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800 block transition duration-300" // Correct dark mode text and hover
              >
                {item.title}
              </Link>
            )}
            <div className="flex gap-x-2 ">
              <div className="flex gap-x-2 items-center">
                <Switch
                  isSelected={isDarkMode}
                  onValueChange={toggleTheme}
                  defaultSelected
                  color="default"
                  size="sm"
                  thumbIcon={({ isSelected, className }) =>
                    isSelected
                      ? <MoonIcon className={className} />
                      : <SunIcon className={className} />}
                />
              </div>
              <div className="flex gap-x-2 items-center">              
                  {" "}{/* Dark mode text color */}
                  <Button className="text-gray-700 dark:text-white" onPress={()=>{navigate('/signin')}}>Signin</Button>
                      
                  {" "}{/* Dark mode text color */}
                  <Button className="text-gray-700 dark:text-white" onPress={()=>{navigate('/signup')}}>Signup</Button>
              </div>
            </div>
          </div>}

        {isMobile &&
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 focus:outline-none dark:text-white  menu-toggle-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>}
      </div>

      {isMobileMenuOpen &&
        <div className="absolute top-1/2 left-0 w-full  shadow-md rounded-b-md dark:bg-gray-900 z-50 mobile-menu ">
          {" "}{/* Added dark mode background */}
          <div className="flex flex-col p-4">
            {menuItems.map((item, idx) =>
              <Link
                key={idx}
                to={item.link}
                className="py-2 px-4 text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800 block transition duration-300" // Correct dark mode text and hover
              >
                {item.title}
              </Link>
            )}
            <div className="py-2 px-4 flex flex-col space-y-2">
              <Switch
                isSelected={isDarkMode}
                onValueChange={toggleTheme}
                defaultSelected
                color="secondary"
                size="sm"
                thumbIcon={({ isSelected, className }) =>
                  isSelected
                    ? <MoonIcon className={className} />
                    : <SunIcon className={className} />}
              />
              <button className="py-2 px-4 text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800 block transition duration-300 w-full">
                {" "}{/* Correct dark mode text and hover */}
                Signin
              </button>
              <button className="py-2 px-4 text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800 block transition duration-300 w-full">
                {" "}{/* Correct dark mode text and hover */}
                Signup
              </button>
            </div>
          </div>
        </div>}
    </nav>
  );
}
