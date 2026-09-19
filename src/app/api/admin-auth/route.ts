import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string };
  const ok = Boolean(password) && checkAdminPassword(password!);
  return Response.json({ ok });
}
