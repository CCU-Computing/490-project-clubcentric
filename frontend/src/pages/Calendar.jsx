import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL;

function Calendar() {
  const [calendars, setCalendars] = useState([])
  const [club1Name, setclub1Name] = useState("")
  const [club2Name, setclub2Name] = useState("")
  
  useEffect(() => {
    fetch(`${API_URL}/api/Calendar/listCalendars/`)
    .then((res) => res.json())
    .then((data) => setCalendars(data))
    .catch((err) => console.error("Error fetching calendars:", err));
  }, []);

  const mergeClubs = () => {
    if (!club1Name || !club2Name || club1Name === club2Name) {
      alert("Please select two different clubs");
      return;
    }

    // Send POST to Django API
    fetch(`${API_URL}/api/Calendar/listCalendars/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `club1_name=${encodeURIComponent(club1Name)}&club2_name=${encodeURIComponent(club2Name)}`,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Merged club created: ${data.new_club_name}`);
        console.log("Merged meetings:", data.meetings);
        console.log("API URL is:", import.meta.env.VITE_API_URL);
        // Optionally add the new club to your state so it renders immediately
        setCalendars((prevClubs) => [
          ...prevClubs,
          {
            id: Date.now(), // temporary key until backend provides real ID
            "Club Name": data.new_club_name,
            Meetings: data.meetings
          }
        ]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Club Calendars</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Club 1:
          <select value={club1Name} onChange={(e) => setclub1Name(e.target.value)}>
            <option value="">--Select--</option>
            {calendars.map((c) => (
              <option key={c.id} value={c["Club Name"]}>{c["Club Name"]}</option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: "10px" }}>
          Club 2:
          <select value={club2Name} onChange={(e) => setclub2Name(e.target.value)}>
            <option value="">--Select--</option>
            {calendars.map((c) => (
              <option key={c.id} value={c["Club Name"]}>{c["Club Name"]}</option>
            ))}
          </select>
        </label>

        <button onClick={mergeClubs} style={{ marginLeft: "10px" }}>
          Merge Clubs
        </button>
      </div>

      <div>
        {calendars.map((c) => (
          <div key={c.id} style={{ marginBottom: "15px" }}>
            <h2>{c["Club Name"]}</h2>
            <ul>
              {c.Meetings?.map((m, i) => (
                <li key={i}>{new Date(m.date).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;