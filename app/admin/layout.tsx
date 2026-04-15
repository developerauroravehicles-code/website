export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-[100dvh] min-h-full bg-zinc-950 text-zinc-100">{children}</div>;
}
