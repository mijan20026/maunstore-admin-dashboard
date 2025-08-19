"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
// import { logout } from "../api/authSlice";
import { logout } from "../../lib/redux/features/authSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // Clear Redux auth state
    dispatch(logout());

    // Remove token from cookies
    Cookies.remove("token");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
