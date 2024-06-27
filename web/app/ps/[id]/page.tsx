export default function ProblemSetViewer({
  params,
}: {
  params: { id: string };
}) {
  return <div>My Post: {params.id}</div>;
}
