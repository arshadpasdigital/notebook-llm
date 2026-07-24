// @Goal: it is side bar of my Project where in header there is a add source button and when we click the button then a model is popup and in sidebar Content we show the list of which we delete it. 

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SourceModal } from "./source-modal"

export function AppSidebar() {
  const [sourceModalOpen, setSourceModalOpen] = useState(false)

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="text-lg font-semibold">Sources</h2>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setSourceModalOpen(true)}
            >
              + Add Source
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Added Sources</SidebarGroupLabel>
            {/* Source items will be rendered here */}
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            {/* Recent sources will be rendered here */}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SourceModal 
        open={sourceModalOpen} 
        setOpen={setSourceModalOpen} 
      />
    </>
  )
}