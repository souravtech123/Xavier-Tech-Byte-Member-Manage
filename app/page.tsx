import { getLandingPageData } from '@/lib/actions';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { events, projects } = await getLandingPageData();
  return <LandingClient initialEvents={events} initialProjects={projects} />;
}
