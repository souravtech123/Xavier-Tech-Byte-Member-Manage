import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { xts_id, email } = await req.json();

    if (!xts_id || !email) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ xts_id, email, role: 'member' });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid xts_id or email' }, { status: 401 });
    }

    const token = signToken({ id: user._id, role: user.role, xts_id: user.xts_id });
    
    const res = NextResponse.json({ success: true, redirect: '/dashboard' });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
