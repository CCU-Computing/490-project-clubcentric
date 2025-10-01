// pages/clubs/[id].jsx
import { useRouter } from "next/router";
import ClubContent from "../../components/ClubContent";

export default function ClubPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => router.push("/")}>Home</button>
      <ClubContent clubId={id} />
    </div>
  );
}
