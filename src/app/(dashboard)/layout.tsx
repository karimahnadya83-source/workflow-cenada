import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar
          userName={session?.user?.name ?? "User"}
          userEmail={session?.user?.email ?? ""}
        />
        <main className="flex-1 bg-muted/40 p-6">{children}</main>
      </div>
    </div>
  );
}