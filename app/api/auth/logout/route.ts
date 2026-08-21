import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const res = NextResponse.redirect(`${origin}/`, { status: 302 });
  res.cookies.delete('token');
  return res;
}
