import MemberProfileClient from './MemberProfileClient';

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <MemberProfileClient id={resolvedParams.id} />;
}

/// this is my first time using nextjs 13 and i am trying to fetch data from the server and pass it to the client component. i have a dynamic route for member profile page and i want to fetch the member data based on the id from the url. i am using async function to get the params and then passing it to the client component.