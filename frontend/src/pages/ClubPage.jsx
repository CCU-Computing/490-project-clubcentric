import { useEffect, useState } from "react";
import { getClubs } from "../services/clubService"; 
import { useNavigate, useParams } from "react-router-dom";
import ClubContent from "../components/ClubContent";

export default function ClubPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // <- for programmatic navigation
  const [club, setClub] = useState(null);
  //const [calendars, setCalendars] = useState([]);

  
  useEffect(() => {
    getClubs(id).then((data) => setClub(data));
  }, [id]);


  if (!club) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate("/")}>Home</button> {/* Home button */}

      <ClubContent clubId={id} />
    </div>
  );
}
