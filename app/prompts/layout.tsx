import { AppLayout } from '@/components/app-layout'

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
