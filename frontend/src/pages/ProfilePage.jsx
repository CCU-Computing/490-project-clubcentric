import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import UserInfoBlock from '../components/profile/UserInfoBlock';
import UserClubsList from '../components/profile/UserClubsList';
import { get_user, update_user } from '../services/userService';
import anonProfilePic from '../assets/images/anon_profile_pic.png';
import ClubCalendars from '../components/calendars/ClubCalendars';

// ------------------------------------------

// Utility for notification styles
const getStatusMessageStyles = (type) => {
    switch (type) {
        case 'success':
            return "p-3 mb-4 rounded-lg text-center bg-green-100 text-green-700";
        case 'error':
            // Required style: light red background (bg-red-100) and centered text (text-red-700, text-center)
            return "p-3 mb-4 rounded-lg text-center bg-red-100 text-red-700"; 
        default:
            return "hidden";
    }
};

const ProfilePage = () => {
    // Initial State
    const [user, setUser] = useState(null); 
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });

    // Function to fetch user data (reusable)
    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const userData = await get_user(null);
            
            if (userData) {
                setUser(userData);
                if (userData.clubs) {
                    setClubs(userData.clubs);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Initial fetch on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    /**
     * Handles the update logic when the EditProfileForm submits.
     * Calls the userService and handles status messages.
     * @param {object} updatedData - Object containing {first_name, last_name, bio}.
     */
    const handleUpdate = async (updatedData) => {
        setStatusMessage({ message: 'Updating profile...', type: 'pending' });
        
        try {
            // Call the service with only the fields we are updating.
            // Pass null for username, email, and profile_picture (for now) so the service ignores them.
            const responseData = await update_user(
                null, // username
                updatedData.first_name, 
                updatedData.last_name, 
                null, // email
                updatedData.bio,
                null // profile_picture
            );

            if (responseData && responseData.status === true) {
                // Re-fetch user data to ensure all components have the latest state
                await fetchUserData();

                setStatusMessage({ message: 'Profile updated successfully!', type: 'success' });
                setIsEditing(false); // Exit editing mode
            } else {
                const errorMessage = responseData?.message || "Failed to update profile. Please try again.";
                setStatusMessage({ message: errorMessage, type: 'error' });
            }
        } catch (error) {
            console.error("Error during profile update:", error);
            setStatusMessage({ message: 'An unexpected error occurred during update.', type: 'error' });
        }
        
        // Clear the status message after 5 seconds
        setTimeout(() => setStatusMessage({ message: '', type: '' }), 5000);
    };


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

    // Prepare the user object for the UserInfoBlock
    const userForDisplay = {
        ...user,
        // Fallback to the default anonymous picture: anon_profile_pic.png
        profile_picture: user.profile_picture || anonProfilePic 
    };

    return (
        <div className="profile-page-container min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto p-4 md:p-8 pt-8"> 
                <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Your Profile
                </h1>
                
                {/* Persistent Notification Bar */}
                {statusMessage.message && (
                    <div className={getStatusMessageStyles(statusMessage.type)}>
                        <p>{statusMessage.message}</p>
                    </div>
                )}

                <UserInfoBlock 
                    user={userForDisplay} 
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleUpdate={handleUpdate} // Pass the update handler
                />
                
                {/* Only display clubs list if not editing */}
                {!isEditing && <UserClubsList clubs={clubs} />}
            </div>
        </div>
    );
};

export default ProfilePage;