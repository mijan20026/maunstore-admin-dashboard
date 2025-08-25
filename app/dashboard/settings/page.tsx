"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Upload, Shield, User, FileText, ScrollText } from "lucide-react";
import dynamic from "next/dynamic";
import { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux"; // ✅ Import this
import { setCredentials } from "@/lib/redux/features/authSlice";

import { useChangePasswordMutation } from "@/lib/redux/features/authApi";
import { useToast } from "@/components/ui/use-toast";

// Import Jodit Editor dynamically to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    adminName: "Admin User",
    adminEmail: "admin@example.com",
    profileImage: "/placeholder-avatar.jpg", // default
  });

  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const [changePassword] = useChangePasswordMutation();
  const { toast } = useToast();

  const privacyEditorRef = useRef(null);
  const termsEditorRef = useRef(null);

  const dispatch = useDispatch();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    console.log("localStorage read:", { token, savedUser });

    if (token && savedUser) {
      dispatch(
        setCredentials({
          user: JSON.parse(savedUser),
          token: token,
        })
      );
    }

    setHydrated(true);
  }, [dispatch]);

  const user = useSelector((state: any) => state.auth.user);
  console.log("Hydrated user:", user);

  useEffect(() => {
    if (user) {
      setSettings({
        adminName: user.name || "",
        adminEmail: user.email || "",
        profileImage: user.profileImage || "/placeholder-avatar.jpg",
      });
    }
  }, [user]);

  // Initialize with default content
  useEffect(() => {
    setPrivacyPolicy(`
      <h3 class="font-medium mb-2">Privacy Policy</h3>
      <p class="text-sm text-muted-foreground mb-4">Last updated: June 15, 2023</p>
      
      <div class="space-y-4 text-sm">
        <p>
          This Privacy Policy describes how we collect, use, and disclose your personal information
          when you use our dashboard and related services.
        </p>
        
        <h4 class="font-medium">Information We Collect</h4>
        <p>
          We collect information you provide directly to us, such as when you create an account,
          update your profile, use interactive features, or contact support.
        </p>
        
        <h4 class="font-medium">How We Use Your Information</h4>
        <p>
          We use the information we collect to provide, maintain, and improve our services,
          to process transactions, send notifications, and communicate with you.
        </p>
        
        <h4 class="font-medium">Data Security</h4>
        <p>
          We implement appropriate security measures to protect your personal information
          against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </div>
    `);

    setTermsConditions(`
      <h3 class="font-medium mb-2">Terms and Conditions</h3>
      <p class="text-sm text-muted-foreground mb-4">Last updated: June 15, 2023</p>
      
      <div class="space-y-4 text-sm">
        <p>
          By accessing or using our dashboard and services, you agree to be bound by these Terms and Conditions.
        </p>
        
        <h4 class="font-medium">User Accounts</h4>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials
          and for all activities that occur under your account.
        </p>
        
        <h4 class="font-medium">Acceptable Use</h4>
        <p>
          You agree not to misuse our services or help anyone else do so. You must not use our services
          for any illegal or unauthorized purpose.
        </p>
        
        <h4 class="font-medium">Modifications to the Service</h4>
        <p>
          We reserve the right to modify or discontinue, temporarily or permanently, the service
          with or without notice at any time.
        </p>
      </div>
    `);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings updated:", settings);
  };

  const handlePrivacyUpdate = () => {
    console.log("Privacy Policy updated:", privacyPolicy);
    setIsPrivacyModalOpen(false);
  };

  const handleTermsUpdate = () => {
    console.log("Terms & Conditions updated:", termsConditions);
    setIsTermsModalOpen(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "All fields are required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "New passwords do not match" });
      return;
    }

    setChangePasswordLoading(true);
    try {
      const token = localStorage.getItem("token"); // Ensure user is authenticated

      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      toast({ title: "Password updated successfully!" });

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Failed to update password",
        description: err?.data?.message || "Something went wrong",
      });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="changePassword">Change Password</TabsTrigger>
          <TabsTrigger value="privacyPolicy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="termsCondition">Terms & Condition</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              {/* <CardDescription>
                Manage your personal profile information
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col gap-4 items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={settings.profileImage}
                      alt={settings.adminName || "Profile"}
                    />
                    <AvatarFallback>Profile</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.adminName}
                      onChange={(e) =>
                        setSettings({ ...settings, adminName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email</Label>
                    <Input
                      id="profileEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, adminEmail: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter your address" />
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div> */}

                <div className="flex justify-center">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changePassword" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="space-y-2 flex justify-center">
                    <Label htmlFor="currentPassword">Current Password</Label>
                  </div>
                  <div className="flex justify-center">
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      className="w-1/2"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-2 flex justify-center">
                    <Label htmlFor="newPassword">New Password</Label>
                  </div>
                  <div className="flex justify-center">
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className="w-1/2"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-2 flex justify-center">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                  </div>
                  <div className="flex justify-center">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="w-1/2"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  className="mt-6 w-1/2"
                  onClick={handleChangePassword}
                  disabled={changePasswordLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {changePasswordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacyPolicy" className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mr-7">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <Button onClick={() => setIsPrivacyModalOpen(true)}>
                Edit Privacy Policy
              </Button>
            </div>
            <CardContent>
              <div className="space-y-">
                <div className="p-4 border rounded-lg max-h-[500px] overflow-y-auto">
                  <div
                    dangerouslySetInnerHTML={{ __html: privacyPolicy }}
                    className="prose max-w-none"
                  />
                </div>

                {/* <div className="flex items-center space-x-2">
                  <Switch id="acceptPrivacy" />
                  <Label htmlFor="acceptPrivacy">
                    I have read and accept the Privacy Policy
                  </Label>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {isPrivacyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-4/5 max-w-4xl bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Edit Privacy Policy
                  </h2>
                  <div className="mb-6">
                    {typeof window !== "undefined" && (
                      <JoditEditor
                        ref={privacyEditorRef}
                        value={privacyPolicy}
                        onChange={setPrivacyPolicy}
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsPrivacyModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePrivacyUpdate}>
                      Update Privacy Policy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="termsCondition" className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mr-7">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5" />
                  Terms and Conditions
                </CardTitle>
              </CardHeader>

              <Button onClick={() => setIsTermsModalOpen(true)}>
                Edit Terms and Conditions
              </Button>
            </div>
            <CardContent>
              <div className="space-y-">
                <div className="p-4 border rounded-lg max-h-[500px] overflow-y-auto">
                  <div
                    dangerouslySetInnerHTML={{ __html: termsConditions }}
                    className="prose max-w-none"
                  />
                </div>

                {/* <div className="flex items-center space-x-2">
                  <Switch id="acceptTerms" />
                  <Label htmlFor="acceptTerms">
                    I have read and accept the Terms and Conditions
                  </Label>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {isTermsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-4/5 max-w-4xl bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Edit Terms and Conditions
                  </h2>
                  <div className="mb-6">
                    {typeof window !== "undefined" && (
                      <JoditEditor
                        ref={termsEditorRef}
                        value={termsConditions}
                        onChange={setTermsConditions}
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsTermsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleTermsUpdate}>
                      Update Terms and Conditions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
