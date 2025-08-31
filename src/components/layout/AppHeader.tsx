
import { Bell, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface AppHeaderProps {
  user?: {
    full_name?: string
    email: string
    avatar_url?: string
  }
  onSignOut?: () => void
}

export function AppHeader({ user, onSignOut }: AppHeaderProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side - Sidebar trigger and branding */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:bg-muted/80 transition-colors" />
            <div className="hidden sm:flex items-center gap-2">
              <img src="/logo.png" alt="UNI-TEL Logo" className="h-10 w-10 object-contain" />
              <h1 className="text-lg font-bold text-foreground tracking-tight">UNI-TEL</h1>
            </div>
        </div>

        {/* Center - Search (hidden on mobile, shown on tablet+) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, papers, subjects..."
              className="pl-10 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all duration-200 rounded-full h-10"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 hover:bg-muted/80 transition-colors">
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-muted/80 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-academic-danger rounded-full animate-pulse"></span>
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted/80 transition-colors">
                <Avatar className="h-9 w-9 ring-2 ring-primary/10 hover:ring-primary/20 transition-all">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-academic-primary to-academic-primary/80 text-white font-semibold text-sm">
                    {getInitials(user?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mr-2 bg-background/95 backdrop-blur-md border shadow-lg" align="end">
              <DropdownMenuLabel className="p-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold leading-none">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted/50">
                <User className="mr-3 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted/50">
                <Bell className="mr-3 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onSignOut} 
                className="p-3 cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
