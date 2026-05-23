import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: 'You must be signed in to view this content.' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    content:
      'This is protected content. You can access it because you are signed in.',
    user: {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    },
  })
}
