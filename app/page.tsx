import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getLandingPageData, getMemberData, getAllDataForAdmin } from '@/lib/actions';
import LandingClient from './LandingClient';
import LoggedInLanding from './LoggedInLanding';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let authUser: any = null;
  if (token) {
    authUser = verifyToken(token);
  }

  // 1. If authenticated member, render personalized portal view
  if (authUser && authUser.role === 'member') {
    const memberData = await getMemberData(authUser.xts_id);
    if (memberData) {
      return <LoggedInLanding memberData={memberData} role="member" />;
    }
  }

  // 2. If authenticated admin, render admin landing overview
  if (authUser && authUser.role === 'admin') {
    const adminData = await getAllDataForAdmin();
    return <LoggedInLanding adminData={adminData} role="admin" />;
  }

  // 3. Unauthenticated / Logged out guest: Show normal public landing page
  const { events, projects } = await getLandingPageData();
  return <LandingClient initialEvents={events} initialProjects={projects} />;
}
