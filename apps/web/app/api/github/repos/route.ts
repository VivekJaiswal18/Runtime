import { NextRequest, NextResponse } from "next/server"

const ACCESS_TOKEN_COOKIE = "github_access_token"

type GitHubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  private: boolean
  default_branch: string
  updated_at: string
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json({ error: "GitHub authorization required" }, { status: 401 })
  }

  const response = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to load GitHub repositories" },
      { status: response.status }
    )
  }

  const repos = ((await response.json()) as GitHubRepo[]).map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    isPrivate: repo.private,
    defaultBranch: repo.default_branch,
    updatedAt: repo.updated_at,
  }))

  return NextResponse.json({ repos })
}
