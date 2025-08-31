
import { useState } from "react"
import { 
  BookOpen, 
  BarChart3, 
  Calendar, 
  ClipboardList, 
  FolderOpen, 
  BookmarkCheck, 
  Shield, 
  Settings, 
  GraduationCap,
  Home,
  Users,
  FileText
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const academicItems = [
  { title: "Dashboard", url: "/", icon: Home, description: "Overview & stats" },
  { title: "Semesters", url: "/semesters", icon: GraduationCap, description: "Academic periods" },
  { title: "Attendance", url: "/attendance", icon: Calendar, description: "Track presence" },
  { title: "Marks", url: "/marks", icon: ClipboardList, description: "Exam scores" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, description: "Performance insights" },
]

const hubItems = [
  { title: "Browse Hub", url: "/hub", icon: FolderOpen, description: "Explore resources" },
  { title: "My Uploads", url: "/hub/uploads", icon: FileText, description: "Your contributions" },
  { title: "Bookmarks", url: "/hub/bookmarks", icon: BookmarkCheck, description: "Saved items" },
]

const adminItems = [
  { title: "Moderation", url: "/moderation", icon: Shield, description: "Content review" },
  { title: "Users", url: "/admin/users", icon: Users, description: "User management" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavCls = (path: string) =>
    `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative ${
      isActive(path) 
        ? "bg-gradient-to-r from-academic-primary to-academic-primary/90 text-primary-foreground shadow-md shadow-primary/20" 
        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground hover:shadow-sm"
    }`

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-72"} transition-all duration-300 border-r border-border/50`}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 backdrop-blur-sm">
        {/* Logo Section */}
        <div className={`p-4 border-b border-sidebar-border/50 ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-academic-primary to-academic-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-sidebar-foreground tracking-tight">UNI-TEL</h2>
                <p className="text-xs text-sidebar-foreground/70 font-medium">Academic Hub</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-academic-primary to-academic-primary/80 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Academic Section */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className={`text-sidebar-foreground/80 font-semibold text-xs uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
            Academic
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {academicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls(item.url)}
                      title={isCollapsed ? `${item.title} - ${item.description}` : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate block">{item.title}</span>
                          <span className="text-xs opacity-70 truncate block">{item.description}</span>
                        </div>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary-foreground/80 rounded-l-full" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Knowledge Hub Section */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className={`text-sidebar-foreground/80 font-semibold text-xs uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
            Knowledge Hub
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {hubItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls(item.url)}
                      title={isCollapsed ? `${item.title} - ${item.description}` : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate block">{item.title}</span>
                          <span className="text-xs opacity-70 truncate block">{item.description}</span>
                        </div>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary-foreground/80 rounded-l-full" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className={`text-sidebar-foreground/80 font-semibold text-xs uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls(item.url)}
                      title={isCollapsed ? `${item.title} - ${item.description}` : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate block">{item.title}</span>
                          <span className="text-xs opacity-70 truncate block">{item.description}</span>
                        </div>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary-foreground/80 rounded-l-full" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto border-t border-sidebar-border/50 px-3 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/settings" 
                      className={getNavCls("/settings")}
                      title={isCollapsed ? "Settings - App preferences" : undefined}
                    >
                      <Settings className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate block">Settings</span>
                          <span className="text-xs opacity-70 truncate block">App preferences</span>
                        </div>
                      )}
                      {isActive("/settings") && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary-foreground/80 rounded-l-full" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
