import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DEMO_USER } from '@/lib/demo-data'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('aio-session')
  
  if (session?.value === 'demo-session') {
    return NextResponse.json(DEMO_USER)
  }
  
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, action } = body

  if (action === 'logout') {
    const response = NextResponse.json({ success: true })
    response.cookies.delete('aio-session')
    return response
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const response = NextResponse.json({ user: DEMO_USER })
  response.cookies.set('aio-session', 'demo-session', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })
  
  return response
}
