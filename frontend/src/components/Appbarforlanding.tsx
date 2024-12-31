import { Link } from "react-router-dom";

export default function Appbarforlanding() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Sport <span className="text-yellow-500">Sphere</span>
        </Link>
        <div className="flex space-x-4 items-center gap-2">
          <Link to="/signin" className="text-gray-700 hover:text-yellow-500">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
