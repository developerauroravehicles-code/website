import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[100dvh]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
