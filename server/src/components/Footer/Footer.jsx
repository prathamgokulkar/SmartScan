// src/components/Footer/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <h3 className="text-xl font-semibold mb-4 md:mb-0">
          MyProduct © {new Date().getFullYear()}
        </h3>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
      <p className="text-center text-gray-500 mt-4 text-sm">
        Built with ❤️ using React and TailwindCSS
      </p>
    </footer>
  );
};

export default Footer;
