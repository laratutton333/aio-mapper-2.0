import { AppLayout } from '@/components/app-layout'

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
