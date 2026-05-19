"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"

type ProjectRow = {
  name: string
  status: "Ready" | "Building" | "Failed"
  url: string
}

const projects: ProjectRow[] = [
  { name: "portfolio", status: "Ready", url: "portfolio.runtime.app" },
  { name: "edu-vault-neo", status: "Building", url: "edu-vault-neo.runtime.app" },
  { name: "cross-guard", status: "Ready", url: "cross-guard.runtime.app" },
  { name: "superdev-app", status: "Failed", url: "superdev-app.runtime.app" },
  { name: "poly-chain", status: "Ready", url: "poly-chain.runtime.app" },
  { name: "einstein-ai", status: "Ready", url: "einstein-ai.runtime.app" },
]

function statusTone(status: ProjectRow["status"]) {
  if (status === "Ready") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
  if (status === "Building") return "bg-blue-500/15 text-blue-400 border-blue-500/30"
  return "bg-red-500/15 text-red-400 border-red-500/30"
}

export function ProjectsSection({ query = "" }: { query?: string }) {
  const normalized = query.trim().toLowerCase()
  const filtered = projects.filter((project) => {
    if (!normalized) return true
    return (
      project.name.toLowerCase().includes(normalized) ||
      project.url.toLowerCase().includes(normalized) ||
      project.status.toLowerCase().includes(normalized)
    )
  })

  return (
    <section id="projects" className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">Projects</h2>
            <Badge variant="outline">{filtered.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8">All status</Button>
            <Button size="sm" variant="outline" className="h-8">Last 30 days</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-12 text-right">More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <TableRow key={project.name}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusTone(project.status)}`}>
                    {project.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{project.url}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${project.name}`}>
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open</DropdownMenuItem>
                      <DropdownMenuItem>View Deployments</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  No projects matched &quot;{query}&quot;.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
