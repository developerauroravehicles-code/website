import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth-server";

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-[100dvh]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
