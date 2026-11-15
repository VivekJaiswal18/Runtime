/* eslint-disable turbo/no-undeclared-env-vars */
import { randomBytes } from "crypto"
import { NextRequest, NextResponse } from "next/server"

const STATE_COOKIE = "github_oauth_state"

export function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const requestUrl = new URL(request.url)
  const requestedReturnTo = requestUrl.searchParams.get("returnTo")
  const returnTo =
    requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//")
      ? requestedReturnTo
      : "/dashboard"

  if (!clientId) {
    const redirectUrl = new URL(returnTo, requestUrl.origin)
    redirectUrl.searchParams.set("github", "error")
    redirectUrl.searchParams.set("reason", "missing_config")
    return NextResponse.redirect(redirectUrl)
  }

  const state = randomBytes(24).toString("hex")
  const callbackUrl = new URL("/api/github/callback", requestUrl.origin)

  const githubUrl = new URL("https://github.com/login/oauth/authorize")
  githubUrl.searchParams.set("client_id", clientId)
  githubUrl.searchParams.set("redirect_uri", callbackUrl.toString())
  githubUrl.searchParams.set("scope", "repo")
  githubUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(githubUrl)
  response.cookies.set(STATE_COOKIE, `${state}:${returnTo}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: requestUrl.protocol === "https:",
    path: "/",
    maxAge: 10 * 60,
  })

  return response
}
