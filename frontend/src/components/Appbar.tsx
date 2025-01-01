import { Link } from "react-router-dom";

export default function Appbar() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Sport <span className="text-yellow-500">Sphere</span>
        </Link>
        <div className="flex space-x-4 items-center gap-2">
          <Link to="/profile" className="text-gray-700 hover:text-yellow-500">
            Profile
          </Link>
          <Link
            to="/"
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Log out
          </Link>
        </div>
      </div>
    </header>
  );
}
