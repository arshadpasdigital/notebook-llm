import { useState, type ComponentType } from "react"
import { FileText, Globe2, Link2, Trash2, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Source, SourceDraft, SourceType } from "@/features/chat/types"
import { SourceModal } from "./source-modal"

interface AppSidebarProps {
  sources: Source[]
  onSourceAdded: (sources: SourceDraft[]) => void
  onRemoveSource: (sourceId: string) => void
}

const sourceLabels: Record<SourceType, string> = {
  pdf: "PDF",
  youtube: "YouTube",
  text: "Text",
  website: "Website",
}

const sourceIcons: Record<SourceType, ComponentType<{ className?: string }>> = {
  pdf: FileText,
  youtube: Link2,
  text: Type,
  website: Globe2,
}

export function AppSidebar({
  sources,
  onSourceAdded,
  onRemoveSource,
}: AppSidebarProps) {
  const [sourceModalOpen, setSourceModalOpen] = useState(false)

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between gap-3 px-4 py-2">
            <h2 className="text-lg font-semibold">Sources</h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => setSourceModalOpen(true)}
            >
              Add source
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {sources.length === 0
                ? "No sources yet"
                : `${sources.length} source${sources.length === 1 ? "" : "s"}`}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {sources.length === 0 ? (
                <p className="px-2 text-sm leading-relaxed text-muted-foreground">
                  Add a PDF, video, website, or text to start a notebook.
                </p>
              ) : (
                <SidebarMenu>
                  {sources.map((source) => {
                    const SourceIcon = sourceIcons[source.type]

                    return (
                      <SidebarMenuItem key={source.id}>
                        <div className="flex items-center gap-1">
                          <SidebarMenuButton
                            className="min-w-0 flex-1"
                            title={source.name}
                          >
                            <SourceIcon className="size-4" />
                            <span className="min-w-0 flex-1 truncate">
                              {source.name}
                            </span>
                            <span className="sr-only">
                              {sourceLabels[source.type]} source,{" "}
                              {source.status}
                            </span>
                          </SidebarMenuButton>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`Remove ${source.name}`}
                            title={`Remove ${source.name}`}
                            onClick={() => onRemoveSource(source.id)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SourceModal
        open={sourceModalOpen}
        setOpen={setSourceModalOpen}
        onSourceAdded={onSourceAdded}
      />
    </>
  )
}
