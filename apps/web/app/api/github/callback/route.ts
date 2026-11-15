/* eslint-disable turbo/no-undeclared-env-vars */
import { NextRequest, NextResponse } from "next/server"

const ACCESS_TOKEN_COOKIE = "github_access_token"
const STATE_COOKIE = "github_oauth_state"

type GitHubTokenResponse = {
  access_token?: string
  error?: string
  error_description?: string
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const state = requestUrl.searchParams.get("state")
  const storedState = request.cookies.get(STATE_COOKIE)?.value
  const [expectedState, returnTo = "/dashboard"] = storedState?.split(":") ?? []
  const redirectUrl = new URL(returnTo, requestUrl.origin)

  if (!code || !state || !expectedState || state !== expectedState) {
    redirectUrl.searchParams.set("github", "error")
    redirectUrl.searchParams.set("reason", "invalid_state")
    return NextResponse.redirect(redirectUrl)
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    redirectUrl.searchParams.set("github", "error")
    redirectUrl.searchParams.set("reason", "missing_config")
    return NextResponse.redirect(redirectUrl)
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL("/api/github/callback", requestUrl.origin).toString(),
    }),
  })

  const tokenData = (await tokenResponse.json()) as GitHubTokenResponse

  if (!tokenResponse.ok || !tokenData.access_token) {
    redirectUrl.searchParams.set("github", "error")
    redirectUrl.searchParams.set("reason", tokenData.error || "token_exchange_failed")
    return NextResponse.redirect(redirectUrl)
  }

  redirectUrl.searchParams.set("github", "connected")

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.delete(STATE_COOKIE)
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokenData.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: requestUrl.protocol === "https:",
    path: "/",
    maxAge: 8 * 60 * 60,
  })

  return response
}
