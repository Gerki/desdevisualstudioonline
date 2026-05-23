// app/(auth)/layout.tsx
// Auth layout (no sidebar)

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
