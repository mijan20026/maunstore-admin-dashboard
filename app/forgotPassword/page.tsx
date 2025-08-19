"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { useLoginMutation } from "../api/apiSlice"; // RTK Query login mutation
import { useDispatch } from "react-redux";
import { setCredentials } from "../api/authSlice"; // Redux slice to store token
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast, ToastContainer } = useToast();

  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the login mutation
      const result = await login({ email, password }).unwrap();

      // Save token in Redux
      dispatch(setCredentials(result));

      // Store token in cookies (for middleware)
      Cookies.set("token", result.token, { expires: 1 }); // 1 day

      toast({ title: "Login successful!" });

      // Redirect to dashboard
      router.push("/dashboard/products");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* <Button type="submit" className="w-full" disabled={loading}> */}
            <Button className="w-full" disabled={loading}>
              <a href="verifyOtp">{loading ? "Sending OTP..." : "Send OTP"}</a>
            </Button>
          </form>
        </CardContent>
      </Card>

      <ToastContainer />
    </div>
  );
}
