import { Plus, Home, Album, Pencil, ChartCandlestick, Settings, BotIcon } from "lucide-react"

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
import Link from "next/link"

// Menu items.
const items = [
    {
    title: "View Aseets",
    url: "/dashboard/rwa-assets",
    icon: Home,
    },
  {
    title: "Add New Asset",
    url: "/dashboard/add-asset",
    icon: Plus,
  },
  {
    title: "Edit Asset",
    url: "/dashboard/add-asset",
    icon: Pencil,
  },
  {
    title: "View Created Assets",
    url: "/dashboard/rwa-assets",
    icon: Album,
  },
  {
    title: "Owned Assets",
    url: "/dashboard/rwa-assets",
    icon: Settings,
  },  
  {
    title: "Asset Trading",
    url: "/dashboard/rwa-assets",
    icon: ChartCandlestick,
  },  
  {
    title: "AI Settings",
    url: "/dashboard/ai-management",
    icon: BotIcon,
  },  
]
export function AppSidebar() {
  return (
    <Sidebar className="bg-slate-950" collapsible='icon'>
      <SidebarContent className="bg-green-400">
        <SidebarGroup>
          <SidebarGroupLabel>Aseetly</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} prefetch={true}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
