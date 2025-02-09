import { Plus, Home, Album, Pencil, ChartCandlestick, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
    title: "View Aseets",
    url: "/",
    icon: Home,
    },
  {
    title: "Add New Asset",
    url: "/",
    icon: Plus,
  },
  {
    title: "Edit Asset",
    url: "/",
    icon: Pencil,
  },
  {
    title: "View Created Assets",
    url: "/",
    icon: Album,
  },
  {
    title: "Owned Assets",
    url: "/",
    icon: Settings,
  },  
  {
    title: "Asset Trading",
    url: "/",
    icon: ChartCandlestick,
  },  
]
export function AppSidebar() {
  return (
    <Sidebar className="bg-slate-950" collapsible='icon'>
      <SidebarContent className="bg-yellow-400">
        <SidebarGroup className="bg-green-600">
          <SidebarGroupLabel>Aseetly</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
