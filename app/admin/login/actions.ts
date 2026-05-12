"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ActionState = { error: string | null };

export async function verifyAdminPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    return { error: "Password is required." };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { error: "Admin access is not configured." };
  }

  if (password !== adminPassword) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  redirect("/admin");
}
