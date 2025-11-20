// frontend/src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import UserInfoBlock from '../components/profile/UserInfoBlock';
import UserClubsList from '../components/profile/UserClubsList';
import anonProfilePic from '../assets/images/anon_profile_pic.png';

// --- MOCK DATA FOR FRONTEND DEVELOPMENT ---
const mockUser = {
    id: 1,
    username: 'jdough',
    first_name: 'Janis',
    last_name: 'Dough',
    email: 'jdough@coastal.edu',
    bio: 'Avid coder and aspiring tree lover! I love working out and all things tech.',
    profile_picture: anonProfilePic,
};

// Mock data for the clubs list
const mockClubs = [
    { id: 1, name: 'One Punch Man Club', description: 'This club is for people who love exercise and being a hero for fun!' },
    { id: 7, name: 'The Code Wranglers', description: 'A club for beginner and experienced programmers.' },
    { id: 12, name: 'Volunteering Outreach Group', description: 'Coordinate and participate in community service.' },
];

// Use this array to test the "no clubs" scenario
const mockEmptyClubs = [];
// ------------------------------------------

const ProfilePage = () => {
    const [user, setUser] = useState(mockUser);
    const [clubs, setClubs] = useState(mockClubs);

    return (
        <div className="profile-page-container min-h-screen bg-gray-100">
            <Navbar />
            {/* Added pt-8 for top padding */}
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