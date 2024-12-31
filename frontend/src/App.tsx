import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";

import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Sportsessions from "./pages/Sportsessions";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sport/:id" element={<Sportsessions />} />
      </Routes>
    </BrowserRouter>
  );
}
