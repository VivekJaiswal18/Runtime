"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { GitHubRepositories } from "@/components/github-repositories"
import { ProjectsSection } from "@/components/projects-section"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  const [query, setQuery] = useState("")
  const [isGithubReposOpen, setIsGithubReposOpen] = useState(false)
  const [githubReposRequestKey, setGithubReposRequestKey] = useState(0)
  const [githubOauthError, setGithubOauthError] = useState<string | null>(null)

  const openGithubRepositories = () => {
    setGithubOauthError(null)
    setIsGithubReposOpen(true)
    setGithubReposRequestKey((key) => key + 1)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("github") === "connected") {
      openGithubRepositories()
      params.delete("github")
      const queryString = params.toString()
      window.history.replaceState(null, "", queryString ? `/dashboard?${queryString}` : "/dashboard")
    }

    if (params.get("github") === "error") {
      setGithubOauthError(params.get("reason") ?? "unknown")
      setIsGithubReposOpen(true)
      params.delete("github")
      params.delete("reason")
      const queryString = params.toString()
      window.history.replaceState(null, "", queryString ? `/dashboard?${queryString}` : "/dashboard")
    }
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader query={query} onQueryChange={setQuery} onGithubImport={openGithubRepositories} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <GitHubRepositories
                isOpen={isGithubReposOpen}
                requestKey={githubReposRequestKey}
                oauthErrorReason={githubOauthError}
                onOpenChange={setIsGithubReposOpen}
              />
              <ProjectsSection query={query} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
