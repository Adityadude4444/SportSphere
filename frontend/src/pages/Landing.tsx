import { useNavigate } from "react-router-dom";
import Appbarforlanding from "../components/Appbarforlanding";

export default function Landing() {
  const navigator = useNavigate();
  return (
    <div className=" min-h-screen ">
      <Appbarforlanding />
      <section className="container mx-auto mt-28 px-6 flex flex-col md:flex-row items-center">
        <div className="flex-1">
          <img
            src="https://t4.ftcdn.net/jpg/02/86/76/77/360_F_286767786_boXM75PDLYIsYWzabZ3fKcM3esv50TNS.jpg"
            alt="Sports Tools"
          />
        </div>

        <div className="flex-1 flex-col text-center md:text-left mt-6 md:mt-0">
          <div className="flex flex-col gap-2">
            {" "}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Sport Sphere
            </h1>
            <p className="text-gray-600 mb-6">
              Explore the world of sports with us. Join sessions, connect with
              players, and take your game to the next level!
            </p>
            <p className="text-xl font-semibold text-gray-800 mb-4 ">
              "A champion is someone who gets up when they can't." – Jack
              Dempsey
            </p>
            <button
              className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 max-w-44"
              onClick={() => navigator("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
