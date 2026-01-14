import { NextResponse } from 'next/server'
import { getPromptRunsData } from '@/lib/demo-data'

export async function GET() {
  const data = getPromptRunsData()
  return NextResponse.json(data)
}
