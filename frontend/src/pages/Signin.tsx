import Appbarforlanding from "../components/Appbarforlanding";
import Authlogin from "../components/Authlogin";

export default function Signup() {
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Login</h1>
            <Authlogin />
          </div>
        </div>
      </section>
    </div>
  );
}
