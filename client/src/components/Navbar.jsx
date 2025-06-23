import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const Navbar = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(BASE_URL + "/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res?.data) setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="flex items-center justify-between bg-gray-300 w-full h-20">
      <div className="mx-5 cursor-pointer">
        <h1 className="text-red-400 text-xl font-bold">STRMLY</h1>
      </div>

      <div className="mx-5 flex gap-5">
        {!user ? (
          <>
            <Link
              to={"/register"}
              className="bg-blue-400 py-2 px-4 text-white rounded-md cursor-pointer hover:bg-blue-500"
            >
              Signup
            </Link>
            <Link
              to={"/login"}
              className="bg-blue-500 py-2 px-4 text-white rounded-md cursor-pointer hover:bg-blue-400"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <Link
              to={"/"}
              className="bg-blue-500 py-2 px-4 text-white rounded-md cursor-pointer hover:bg-blue-400"
            >
              Dashboard
            </Link>
            <Link
              to={"/upload"}
              className="bg-gray-500 py-2 px-4 text-white rounded-md cursor-pointer hover:bg-gray-400"
            >
              Upload
            </Link>
            <button
                onClick={handleLogout}
              className="bg-red-500 py-2 px-4 text-white rounded-md cursor-pointer hover:bg-red-400"
            >
              Logout
            </button>
            
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
