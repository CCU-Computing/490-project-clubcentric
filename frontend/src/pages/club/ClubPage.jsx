import { useEffect, useState } from "react";
import { get_club, get_membership } from "../../services/clubService";
import { get_user } from "../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { ClubInfoCard } from "../../components/!card/club/ClubInfoCard";
import { MembershipCard } from "../../components/!card/club/MembershipCard";
import { ClubCalendarCard } from "../../components/!card/club/ClubCalendarCard";
import { ClubDocumentCard } from "../../components/!card/club/ClubDocumentCard";
import { CalendarDetailCard } from "../../components/!card/shared/CalendarDetailCard";
import { DocumentDetailCard } from "../../components/!card/shared/DocumentDetailCard";

export default function ClubPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);

  useEffect(() => {
    fetchClubData();
  }, [id]);

  const fetchClubData = async () => {
    setLoading(true);
    try {
      // Fetch club data
      const clubData = await get_club(id);
      if (clubData) {
        setClub(clubData);
      }

      // Fetch current user - handle failure gracefully
      try {
        const userData = await get_user(null);
        if (userData) {
          setCurrentUser(userData);

          // Get user's role in this club
          try {
            const membership = await get_membership(id, userData.id);
            if (membership) {
              setUserRole(membership.role);
            }
          } catch (err) {
            // User might not be a member - that's okay
            console.log("User is not a member of this club");
          }
        }
      } catch (err) {
        // User data failed to load - still show club
        console.error("Failed to load user data:", err);
      }
    } catch (error) {
      console.error("Error fetching club data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = () => {
    // Navigate back to search after club deletion
    navigate("/search");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl">
          Loading Club...
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl text-red-600">
          Club not found.
        </div>
      </div>
    );
  }

  const canEdit = userRole === 'organizer';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 md:p-8 pt-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/search")}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          ← Back to Search
        </button>

        {/* Club Info Card */}
        <ClubInfoCard
          club={club}
          userRole={userRole}
          currentUserId={currentUser?.id}
          onDelete={handleDeleteClub}
          onClubUpdate={fetchClubData}
          onMembershipChange={fetchClubData}
        />

        {/* Membership Card */}
        <MembershipCard
          clubId={id}
          currentUserId={currentUser?.id}
          userRole={userRole}
        />

        {/* Show calendar detail if one is selected */}
        {selectedCalendar ? (
          <CalendarDetailCard
            calendar={selectedCalendar}
            canEdit={canEdit}
            onBack={() => setSelectedCalendar(null)}
          />
        ) : (
          <ClubCalendarCard
            clubId={id}
            userRole={userRole}
            onSelectCalendar={setSelectedCalendar}
          />
        )}

        {/* Show document manager detail if one is selected */}
        {selectedManager ? (
          <DocumentDetailCard
            manager={selectedManager}
            canEdit={canEdit}
            onBack={() => setSelectedManager(null)}
          />
        ) : (
          <ClubDocumentCard
            clubId={id}
            userRole={userRole}
            onSelectManager={setSelectedManager}
          />
        )}
      </div>
    </div>
  );
}
