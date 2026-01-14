import { NextResponse } from 'next/server'
import { getRecommendationsData } from '@/lib/demo-data'

export async function GET() {
  const data = getRecommendationsData()
  return NextResponse.json(data)
}
