import Link from "next/link"
import {
  ActivityIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  Clock3Icon,
  CopyIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GlobeIcon,
  ListChecksIcon,
  SearchIcon,
  TerminalSquareIcon,
  UserRoundIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DeploymentPageProps = {
  params: Promise<{ projectId: string }>
}

const logLines = [
  "13:48:33.265  installing dependencies...",
  "13:48:33.511  vite v8.0.10 building client environment for production...",
  "13:48:34.013  transforming... 26 modules transformed.",
  "13:48:34.086  rendering chunks...",
  "13:48:34.161  computing gzip size...",
  "13:48:35.004  dist/index.html                  0.52 kB",
  "13:48:35.117  dist/assets/index-B8oFn6e7y.js  184.32 kB",
  "13:48:35.219  build completed successfully.",
]

const checks = [
  { label: "Install dependencies", status: "Passed", duration: "1s" },
  { label: "Build command", status: "Passed", duration: "3s" },
  { label: "Upload static assets", status: "Passed", duration: "1s" },
]

function DetailItem({
  label,
  children,
}: Readonly<{
  label: string
  children: React.ReactNode
}>) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{children}</div>
    </div>
  )
}

export default async function DeploymentDetailPage({ params }: DeploymentPageProps) {
  const { projectId } = await params
  const isDummyProject = projectId === "rntm-dummy"
  const projectName = isDummyProject ? "runtime-demo" : "portfolio"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" asChild aria-label="Back to dashboard">
              <Link href="/dashboard">
                <ArrowLeftIcon />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Deployments</span>
                <span>/</span>
                <span className="font-mono text-foreground">{projectId}</span>
                <CopyIcon className="size-3" />
              </div>
              <h1 className="mt-1 text-xl font-semibold">{projectName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <TerminalSquareIcon className="size-4" />
              Logs
            </Button>
            <Button size="sm" className="gap-2">
              Visit
              <ExternalLinkIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
        <nav className="flex gap-2 border-b pb-3 text-sm">
          {["Deployment", "Logs", "Resources", "Source", "Open Graph"].map((item, index) => (
            <Button key={item} variant={index === 0 ? "secondary" : "ghost"} size="sm">
              {item}
            </Button>
          ))}
        </nav>

        <section className="overflow-hidden rounded-lg border bg-card">
          <div className="border-b px-5 py-3">
            <h2 className="text-base font-semibold">Deployment Details</h2>
          </div>
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(280px,500px)_1fr]">
            <div className="flex aspect-video items-center justify-center rounded-md border bg-muted/35">
              <div className="w-3/4 rounded-md border bg-background p-5 shadow-sm">
                <div className="mb-8 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>EST. 2026</span>
                  <span>runtime.app</span>
                </div>
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/15">
                    <UserRoundIcon className="size-6" />
                  </div>
                  <p className="font-semibold">{projectName}</p>
                  <p className="text-xs text-muted-foreground">
                    A deployed preview with build logs, summary, checks, and source metadata.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <DetailItem label="Created">
                <span className="inline-flex items-center gap-2">
                  <UserRoundIcon className="size-4" />
                  VivekJaiswal18
                </span>
                <span className="ml-2 text-muted-foreground">May 21</span>
              </DetailItem>
              <DetailItem label="Status">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  Ready
                  <span className="text-muted-foreground">Latest</span>
                </span>
              </DetailItem>
              <DetailItem label="Duration">
                <span className="inline-flex items-center gap-2">
                  <Clock3Icon className="size-4" />
                  5s
                  <span className="text-muted-foreground">38d ago</span>
                </span>
              </DetailItem>
              <DetailItem label="Environment">
                <span className="inline-flex items-center gap-2">
                  <GlobeIcon className="size-4" />
                  Production
                  <Badge variant="secondary">Current</Badge>
                </span>
              </DetailItem>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Domains</p>
                <div className="space-y-2 text-sm font-medium">
                  <p>portfolio-ebon-five-xpzin71n9f.vercel.app</p>
                  <p>portfolio-git-main-vivek-jaiswals-projects.vercel.app</p>
                  <p>portfolio-ftrmwa9sr-vivek-jaiswals-projects.vercel.app</p>
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Source</p>
                <div className="space-y-2 text-sm font-medium">
                  <p className="inline-flex items-center gap-2">
                    <GitBranchIcon className="size-4" />
                    main
                  </p>
                  <p>8c5f4c2 fix-content</p>
                </div>
              </div>
            </div>
          </div>

          <details className="border-t px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold">
              <ChevronDownIcon className="size-4" />
              Deployment Settings
              <Badge variant="secondary">4 Recommendations</Badge>
            </summary>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <p>Framework preset: Vite</p>
              <p>Build command: pnpm build</p>
              <p>Output directory: dist</p>
              <p>Node.js version: 22.x</p>
            </div>
          </details>
        </section>

        <details open className="overflow-hidden rounded-lg border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between border-b px-5 py-4">
            <span className="inline-flex items-center gap-3 font-semibold">
              <ChevronDownIcon className="size-4" />
              Build Logs
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              5s
              <CheckCircle2Icon className="size-5 text-blue-500" />
            </span>
          </summary>
          <div className="border-b px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <TerminalSquareIcon className="size-4" />
                {logLines.length} lines
              </span>
              <div className="relative w-full max-w-xs">
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Find in logs" className="h-9 pl-8" />
              </div>
            </div>
          </div>
          <pre className="max-h-72 overflow-auto bg-black p-5 text-sm leading-7 text-white">
            {logLines.map((line) => (
              <code key={line} className="block">
                {line}
              </code>
            ))}
          </pre>
        </details>

        <details className="overflow-hidden rounded-lg border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
            <span className="inline-flex items-center gap-3 font-semibold">
              <ChevronDownIcon className="size-4" />
              Build Summary
            </span>
            <ActivityIcon className="size-4 text-muted-foreground" />
          </summary>
          <div className="border-t px-5 py-4 text-sm text-muted-foreground">
            Production build completed successfully. Static assets were generated, optimized, and assigned immutable cache headers.
          </div>
        </details>

        <details className="overflow-hidden rounded-lg border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
            <span className="inline-flex items-center gap-3 font-semibold">
              <ChevronDownIcon className="size-4" />
              Deployment Checks
            </span>
            <ListChecksIcon className="size-4 text-muted-foreground" />
          </summary>
          <div className="border-t">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center justify-between border-b px-5 py-3 last:border-b-0">
                <span className="inline-flex items-center gap-2 text-sm">
                  <CheckCircle2Icon className="size-4 text-emerald-500" />
                  {check.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {check.status} - {check.duration}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </main>
  )
}
