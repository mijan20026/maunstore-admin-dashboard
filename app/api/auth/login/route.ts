import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Example: hardcoded user (replace with real DB logic)
  const validEmail = "admin@example.com";
  const validPassword = "123";

  if (email === validEmail && password === validPassword) {
    return NextResponse.json(
      { token: "fake-jwt-token", user: { email } },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
