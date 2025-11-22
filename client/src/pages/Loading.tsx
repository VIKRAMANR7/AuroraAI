import { useEffect } from "react";
import { useAppContext } from "../context/AppContextValue";

export default function Loading() {
  const { fetchUser, navigate } = useAppContext();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchUser();
      navigate("/");
    }, 8000);

    return () => clearTimeout(timeout);
  }, [fetchUser, navigate]);

  return (
    <div className="bg-linear-to-b from-[#531b81] to-[#29184b] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl">
      <div className="size-10 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
    </div>
  );
}
