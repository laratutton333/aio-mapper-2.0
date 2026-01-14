import { NextResponse } from 'next/server'
import { getCitationsData } from '@/lib/demo-data'

export async function GET() {
  const data = getCitationsData()
  return NextResponse.json(data)
}
