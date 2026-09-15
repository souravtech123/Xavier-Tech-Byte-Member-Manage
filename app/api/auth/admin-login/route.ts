import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/models/User';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Hardcoded admin login
    if (email === 'ankit@admin2026' && password === 'ankit_755_24-27') {
      const token = signToken({ id: 'hardcoded-admin-id', role: 'admin', xts_id: 'admin' });
      
      const res = NextResponse.json({ success: true, redirect: '/admin' });
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 1 day
      });

      return res;
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email, role: 'admin' });
    
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = signToken({ id: user._id, role: user.role, xts_id: user.xts_id });
    
    const res = NextResponse.json({ success: true, redirect: '/admin' });
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
