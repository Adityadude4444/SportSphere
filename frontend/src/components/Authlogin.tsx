import { useState } from "react";
import { Labelbox } from "./minicomponents/Labelbox";
import axios from "axios";
import { BACKEND_URL } from "../config/Config";
import { useNavigate } from "react-router-dom";
interface Signinips {
  email: string;
  password: string;
}
const Authlogin = () => {
  const navigator = useNavigate();
  const [postips, setpostips] = useState<Signinips>({
    email: "",
    password: "",
  });
  return (
    <div className="flex flex-col gap-2">
      <Labelbox
        label="Email"
        placeholder="Enter your email"
        onchange={(e) =>
          setpostips({
            ...postips,
            email: (e.target as HTMLInputElement).value,
          })
        }
      />
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">Password</label>
        <input
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          type="password"
          onChange={(e) =>
            setpostips({
              ...postips,
              password: (e.target as HTMLInputElement).value,
            })
          }
        />
      </div>
      <div>
        <h3>
          Don't have account{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => {
              navigator("/signup");
            }}
          >
            Signup
          </span>
        </h3>
      </div>
      <button
        className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 max-w-44"
        onClick={async () => {
          try {
            const res = await axios.post(
              `${BACKEND_URL}/api/v1/login`,
              postips
            );
            if (res.status !== 200) {
              throw new Error("Failed to login");
            }
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            navigator("/dashboard");
          } catch (error: any) {
            console.log("Error while logging in: ", error);
          }
        }}
      >
        Signup
      </button>
    </div>
  );
};

export default Authlogin;
