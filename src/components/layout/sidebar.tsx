"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Target,
  Kanban,
  CheckSquare,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customer", href: "/customers", icon: Users },
  { label: "Leads", href: "/leads", icon: Target },
  { label: "Pipeline", href: "/pipeline", icon: Kanban },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Jadwal", href: "/schedules", icon: Calendar },
  { label: "WA Template", href: "/wa-templates", icon: MessageSquare },
  { label: "Reporting", href: "/reports", icon: BarChart3 },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-semibold">CRM Kursus</span>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}