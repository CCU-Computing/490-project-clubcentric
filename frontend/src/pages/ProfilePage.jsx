import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfileCard } from '../components/!card/user/UserProfileCard';
import { UserCalendarCard } from '../components/!card/user/UserCalendarCard';
import { UserDocumentCard } from '../components/!card/user/UserDocumentCard';
import { CalendarDetailCard } from '../components/!card/shared/CalendarDetailCard';
import { DocumentDetailCard } from '../components/!card/shared/DocumentDetailCard';
import { get_user } from '../services/userService';
import { get_membership } from '../services/clubService';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userClubs, setUserClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            // Fetch current user's data
            const userData = await get_user(null);

            if (userData) {
                setUser(userData);

                // Fetch clubs user is a member of
                try {
                    const memberships = await get_membership(null, null);
                    // memberships is {club_id: role} dict
                    if (memberships && typeof memberships === 'object') {
                        const clubIds = Object.keys(memberships);
                        // TODO: Fetch full club details for these IDs
                        setUserClubs(clubIds);
                    }
                } catch (error) {
                    console.error("Error fetching user clubs:", error);
                    setUserClubs([]);
                }
            } else {
                console.error("Failed to fetch user data or user is not logged in.");
                navigate('/login');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = () => {
        // Redirect to login after account deletion
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="profile-page-container min-h-screen bg-gray-100">
                <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl">
                    Loading Profile...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-page-container min-h-screen bg-gray-100">

                <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl text-red-600">
                    You must be logged in to view this page.
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page-container min-h-screen bg-gray-100">
            <div className="container mx-auto p-4 md:p-8 pt-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Your Profile
                </h1>

                {/* User Profile Card */}
                <UserProfileCard
                    userId={user.id}
                    currentUserId={user.id}
                    onDelete={handleDeleteUser}
                />

                {/* My Clubs Section */}
                {userClubs.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-header">
                            <h2 className="card-title">My Clubs</h2>
                        </div>
                        <div className="card-body">
                            <p className="text-gray-600">You are a member of {userClubs.length} club(s)</p>
                        </div>
                    </div>
                )}

                {/* Show calendar detail if one is selected */}
                {selectedCalendar ? (
                    <CalendarDetailCard
                        calendar={selectedCalendar}
                        canEdit={true}
                        onBack={() => setSelectedCalendar(null)}
                    />
                ) : (
                    <UserCalendarCard
                        userId={user.id}
                        currentUserId={user.id}
                        onSelectCalendar={setSelectedCalendar}
                    />
                )}

                {/* Show document manager detail if one is selected */}
                {selectedManager ? (
                    <DocumentDetailCard
                        manager={selectedManager}
                        canEdit={true}
                        onBack={() => setSelectedManager(null)}
                    />
                ) : (
                    <UserDocumentCard
                        userId={user.id}
                        currentUserId={user.id}
                        onSelectManager={setSelectedManager}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
