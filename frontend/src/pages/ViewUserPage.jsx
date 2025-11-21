import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import { UserProfileCard } from '../components/!card/user/UserProfileCard';
import { get_user } from '../services/userService';
import { getClubs } from '../services/clubService';

const ViewUserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [viewedUser, setViewedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userClubs, setUserClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            // Fetch the user being viewed
            const userData = await get_user(id);
            if (userData) {
                setViewedUser(userData);

                // Fetch clubs user is a member of
                const allClubs = await getClubs();
                // For now, showing all clubs - ideally filter by this user's membership
                setUserClubs(allClubs || []);
            } else {
                console.error("Failed to fetch user data.");
            }

            // Fetch current logged-in user for permission checks
            const currentUserData = await get_user(null);
            if (currentUserData) {
                setCurrentUser(currentUserData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="view-user-page-container min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl">
                    Loading User Profile...
                </div>
            </div>
        );
    }

    if (!viewedUser) {
        return (
            <div className="view-user-page-container min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl text-red-600">
                    User not found.
                </div>
            </div>
        );
    }

    // Check if viewing own profile - redirect to profile page if so
    if (currentUser && currentUser.id === viewedUser.id) {
        navigate('/profile');
        return null;
    }

    return (
        <div className="view-user-page-container min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto p-4 md:p-8 pt-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
                    User Profile
                </h1>

                {/* User Profile Card - read-only view */}
                <UserProfileCard
                    userId={viewedUser.id}
                    currentUserId={currentUser?.id}
                />

                {/* User's Clubs Section */}
                {userClubs.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-header">
                            <h2 className="card-title">Clubs</h2>
                        </div>
                        <div className="card-body">
                            <ul className="card-list">
                                {userClubs.map((club) => (
                                    <li key={club.id} className="card-list-item">
                                        <div className="list-item-content">
                                            <h3 className="list-item-title">{club.name}</h3>
                                            <p className="list-item-subtitle">{club.description}</p>
                                        </div>
                                        <div className="list-item-actions">
                                            <button
                                                onClick={() => navigate(`/club/${club.id}`)}
                                                className="action-button btn-primary"
                                            >
                                                View Club
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Note: Calendars and documents are private - only shown on user's own profile */}
            </div>
        </div>
    );
};

export default ViewUserPage;
