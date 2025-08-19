"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
// import { useVerifyOtpMutation } from "../api/apiSlice"; // RTK Query mutation

export default function VerifyOtpForm() {
  const router = useRouter();
  const { toast, ToastContainer } = useToast();
//   const [verifyOtp] = useVerifyOtpMutation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
    //   const result = await verifyOtp({ otp }).unwrap();
      toast({ title: "OTP verified successfully!" });

      // Redirect to reset password or dashboard
      router.push("/resetPassword"); 
    } catch (error: any) {
      toast({
        title: "OTP verification failed",
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
          <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center mt-2">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => toast({ title: "OTP resent!" })}
              >
                Resend OTP
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ToastContainer />
    </div>
  );
}
