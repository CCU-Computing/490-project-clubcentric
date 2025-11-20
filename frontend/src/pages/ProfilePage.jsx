// frontend/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react'; // Import useEffect
import Navbar from '../components/navbar/Navbar';
import UserInfoBlock from '../components/profile/UserInfoBlock';
import UserClubsList from '../components/profile/UserClubsList';
import { get_user } from '../services/userService'; // Import get_user service
import anonProfilePic from '../assets/images/anon_profile_pic.png';

// Mock data for the clubs list (Keep this for now, until club data is also fetched)
const mockClubs = [
    { id: 1, name: 'One Punch Man Club', description: 'This club is for people who love exercise and being a hero for fun!' },
    { id: 7, name: 'The Code Wranglers', description: 'A club for beginner and experienced programmers.' },
    { id: 12, name: 'Volunteering Outreach Group', description: 'Coordinate and participate in community service.' },
];
// ------------------------------------------

const ProfilePage = () => {
    // Initialize user state to null and add a loading state
    const [user, setUser] = useState(null); 
    const [clubs, setClubs] = useState(mockClubs);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                // Call get_user with null to fetch the currently logged-in user's data
                const userData = await get_user(null);
                
                if (userData) {
                    // Assuming userData is the user object directly.
                    setUser(userData);
                    // If the backend also returned club data, you would setClubs(userData.clubs) here.
                } else {
                    console.error("Failed to fetch user data or user is not logged in.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array runs once on mount

    // --- Loading and Error Handling ---

    if (isLoading) {
        return (
            <div className="profile-page-container min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl">
                    Loading Profile...
                </div>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="profile-page-container min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl text-red-600">
                    You must be logged in to view this page.
                </div>
            </div>
        );
    }

    // Prepare the user object for the UserInfoBlock, ensuring a profile_picture is present
    const userForDisplay = {
        ...user,
        // Fallback to the default anonymous picture if the fetched data is missing one
        profile_picture: user.profile_picture || anonProfilePic 
    };

    return (
        <div className="profile-page-container min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto p-4 md:p-8 pt-8"> 
                <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Your Profile
                </h1>

                <UserInfoBlock user={userForDisplay} />
                <UserClubsList clubs={clubs} />
            </div>
        </div>
    );
};

export default ProfilePage;