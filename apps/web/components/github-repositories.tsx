"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLinkIcon, GitBranchIcon, LockIcon, SearchIcon, XIcon } from "lucide-react"

type GitHubRepository = {
  id: number
  name: string
  fullName: string
  url: string
  isPrivate: boolean
  defaultBranch: string
  updatedAt: string
}

type GitHubRepositoriesProps = {
  isOpen: boolean
  requestKey: number
  oauthErrorReason: string | null
  onOpenChange: (open: boolean) => void
}

function GitHubMark() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function oauthErrorMessage(reason: string) {
  if (reason === "missing_config") {
    return "GitHub OAuth is not configured on the web server. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to the apps/web runtime environment."
  }

  if (reason === "invalid_state") {
    return "GitHub could not verify this authorization attempt. Close this modal and try again."
  }

  if (reason === "token_exchange_failed") {
    return "GitHub authorization succeeded, but the app could not exchange the callback code for an access token."
  }

  return "GitHub authorization failed. Close this modal and try again."
}

export function GitHubRepositories({
  isOpen,
  requestKey,
  oauthErrorReason,
  onOpenChange,
}: GitHubRepositoriesProps) {
  const [repos, setRepos] = useState<GitHubRepository[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "connected" | "unauthorized" | "error">("idle")
  const [refreshKey, setRefreshKey] = useState(0)
  const [importingRepoId, setImportingRepoId] = useState<number | null>(null)
  const [repoQuery, setRepoQuery] = useState("")

  useEffect(() => {
    if (!isOpen || oauthErrorReason) return

    let ignore = false

    async function loadRepos() {
      setStatus("loading")

      try {
        const response = await fetch("/api/github/repos", { cache: "no-store" })

        if (response.status === 401) {
          if (!ignore) {
            setStatus("unauthorized")
          }
          return
        }

        if (!response.ok) {
          if (!ignore) setStatus("error")
          return
        }

        const data = (await response.json()) as { repos: GitHubRepository[] }

        if (!ignore) {
          setRepos(data.repos)
          setStatus("connected")
        }
      } catch {
        if (!ignore) setStatus("error")
      }
    }

    loadRepos()

    return () => {
      ignore = true
    }
  }, [isOpen, oauthErrorReason, requestKey, refreshKey])

  if (!isOpen) {
    return null
  }

  const handleImport = (repo: GitHubRepository) => {
    setImportingRepoId(repo.id)

    const params = new URLSearchParams({
      name: repo.name,
      repoUrl: repo.url,
      branch: repo.defaultBranch,
    })

    window.location.href = `/deploy?${params.toString()}`
  }

  const normalizedRepoQuery = repoQuery.trim().toLowerCase()
  const filteredRepos = repos.filter((repo) => {
    if (!normalizedRepoQuery) return true

    return (
      repo.name.toLowerCase().includes(normalizedRepoQuery) ||
      repo.fullName.toLowerCase().includes(normalizedRepoQuery) ||
      repo.defaultBranch.toLowerCase().includes(normalizedRepoQuery)
    )
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="github-repositories-title"
        className="flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <GitHubMark />
            <h2 id="github-repositories-title" className="text-sm font-semibold">
              Import from GitHub
            </h2>
            <Badge variant="outline">{status === "connected" ? repos.length : "..."}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-2"
              onClick={() => {
                setRefreshKey((key) => key + 1)
              }}
            >
              <GitHubMark />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close GitHub repositories"
              onClick={() => onOpenChange(false)}
            >
              <XIcon />
            </Button>
          </div>
        </div>

        <div className="border-b px-4 py-3">
          <div className="relative max-w-md">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={repoQuery}
              onChange={(event) => setRepoQuery(event.target.value)}
              placeholder="Search repositories"
              className="h-9 bg-muted/35 pl-8"
              aria-label="Search repositories"
            />
          </div>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-16 text-right">Open</TableHead>
                <TableHead className="w-24 text-right">Import</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!oauthErrorReason && (status === "loading" || status === "idle") ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Loading repositories...
                  </TableCell>
                </TableRow>
              ) : null}

              {oauthErrorReason ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                      <p className="text-sm font-medium">GitHub authorization did not finish.</p>
                      <p className="text-sm text-muted-foreground">{oauthErrorMessage(oauthErrorReason)}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}

              {!oauthErrorReason && status === "unauthorized" ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        GitHub authorization is required to load repositories.
                      </p>
                      <Button
                        className="gap-2"
                        onClick={() => {
                          window.location.href = "/api/github/auth?returnTo=/dashboard"
                        }}
                      >
                        <GitHubMark />
                        Authorize GitHub
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}

              {!oauthErrorReason && status === "error" ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Could not load GitHub repositories.
                  </TableCell>
                </TableRow>
              ) : null}

              {!oauthErrorReason && status === "connected" && repos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No repositories returned from GitHub.
                  </TableCell>
                </TableRow>
              ) : null}

              {!oauthErrorReason && status === "connected" && repos.length > 0 && filteredRepos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No repositories matched &quot;{repoQuery}&quot;.
                  </TableCell>
                </TableRow>
              ) : null}

              {status === "connected"
                ? filteredRepos.map((repo) => (
                    <TableRow key={repo.id}>
                      <TableCell className="font-medium">{repo.fullName}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {repo.isPrivate ? <LockIcon className="size-3" /> : null}
                          {repo.isPrivate ? "Private" : "Public"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <GitBranchIcon className="size-3" />
                          {repo.defaultBranch}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(repo.updatedAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" asChild aria-label={`Open ${repo.fullName}`}>
                          <a href={repo.url} target="_blank" rel="noreferrer">
                            <ExternalLinkIcon />
                          </a>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="h-8"
                          disabled={importingRepoId === repo.id}
                          onClick={() => handleImport(repo)}
                        >
                          {importingRepoId === repo.id ? "Importing" : "Import"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
