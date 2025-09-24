import { useState } from "react";
import ClubForm from "./ClubForm";
import CalendarModule from "./CalendarModule";
import DocumentModule from "./DocumentModule";

export default function HomePage() {
  const [club, setClub] = useState(null);

  return (
    <div>
      {!club && <ClubForm onCreate={(newClub) => setClub(newClub)} />}
      {club && (
        <div>
          <h2>{club.name} Dashboard</h2>
          <CalendarModule clubId={club.slug_id} />
          <DocumentModule clubId={club.slug_id} />
        </div>
      )}
    </div>
  );
}
