import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Validate a GitHub personal access token by calling /user with it.
 * Returns the authenticated login + current rate-limit ceiling so the UI can
 * confirm the token works before saving it in the browser.
 */
export async function POST(request: Request) {
  let token = "";
  try {
    const body = await request.json();
    token = (body?.token ?? "").trim();
  } catch {
    /* fall through */
  }
  if (!token) {
    return NextResponse.json({ valid: false, reason: "empty" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "changeloom",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return NextResponse.json({ valid: false, reason: "unauthorized" });
    }
    if (!res.ok) {
      return NextResponse.json(
        { valid: false, reason: "error", status: res.status },
        { status: 502 },
      );
    }

    const user = await res.json();
    return NextResponse.json({
      valid: true,
      login: user.login as string,
      avatarUrl: user.avatar_url as string,
      limit: Number(res.headers.get("x-ratelimit-limit") ?? 5000),
      remaining: Number(res.headers.get("x-ratelimit-remaining") ?? 0),
    });
  } catch {
    return NextResponse.json(
      { valid: false, reason: "network" },
      { status: 502 },
    );
  }
}
