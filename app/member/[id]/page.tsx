import MemberProfileClient from './MemberProfileClient';

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <MemberProfileClient id={resolvedParams.id} />;
}
