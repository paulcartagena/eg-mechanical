import React, { useState } from "react";

export const HamburguerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger menu button */}
      <img
        src="/icons/menu.svg"
        width={48}
        color="white"
        className="cursor-pointer md:hidden"
        onClick={toggleMenu}
        alt="Open Menu"
      />

      {/* Dropdown menu */}
      <div
        className={`w-full md:max-w-[1200px] flex flex-col fixed inset-0 h-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg transform ${
          isMenuOpen ? "translate-x-0 overflow-hidden" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        {/* Close button */}
        <div className="absolute top-9 right-5 md:right-8 mx-4 z-50">
          <img
            src="/icons/close.svg"
            width={40}
            className="cursor-pointer"
            onClick={toggleMenu}
            alt="Close Menu"
          />
        </div>

        {/* Menu content */}
        <div className="flex mx-auto min-h-screen">
          <ul className="text-white text-2xl flex flex-col items-center justify-center space-y-14">
            <li>
              <a
                href="/"
                className="hover:text-blue-400 transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-blue-400 transition duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/projects"
                className="hover:text-blue-400 transition duration-300"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="/#services"
                className="hover:text-blue-400 transition duration-300"
                onClick={toggleMenu}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="hover:text-blue-400 transition duration-300"
                onClick={toggleMenu}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default HamburguerMenu;
