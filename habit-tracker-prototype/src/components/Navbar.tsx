import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4 w-full">
      <ul className="flex space-x-6">
        <li>
          <Link
            to="/"
            className="text-white text-lg hover:text-gray-300"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="text-white text-lg hover:text-gray-300"
          >
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
