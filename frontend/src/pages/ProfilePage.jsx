// frontend/src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import UserInfoBlock from '../components/profile/UserInfoBlock';
import UserClubsList from '../components/profile/UserClubsList';
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
                
                <div className="container mx-auto p-4 md:p-8 pt-8 text-center text-xl text-red-600">
                    You must be logged in to view this page.
                </div>
            </div>
        );
    }

const ProfilePage = () => {
    const [user, setUser] = useState(mockUser);
    const [clubs, setClubs] = useState(mockClubs);

    return (
        <div className="profile-page-container min-h-screen bg-gray-100">
            
            <div className="container mx-auto p-4 md:p-8 pt-8"> 
                <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Your Profile
                </h1>

                <UserInfoBlock user={user} />
                <UserClubsList clubs={clubs} />
            </div>
        </div>
    );
};

export default ProfilePage;