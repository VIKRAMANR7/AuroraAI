import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import ChatBox from "./components/ChatBox";
import Sidebar from "./components/Sidebar";
import { useAppContext } from "./context/AppContext";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import Login from "./pages/Login";

export default function App() {
  const { user } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "loading") return <Loading />;
  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 size-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
}
