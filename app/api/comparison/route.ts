import { NextResponse } from 'next/server'
import { getComparisonData } from '@/lib/demo-data'

export async function GET() {
  const data = getComparisonData()
  return NextResponse.json(data)
}
