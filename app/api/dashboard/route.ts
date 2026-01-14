import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/demo-data'

export async function GET() {
  const data = getDashboardData()
  return NextResponse.json(data)
}
