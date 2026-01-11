// src/components/Footer/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <span className="text-sm text-gray-500">
          MultiAgent SmartScan © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
