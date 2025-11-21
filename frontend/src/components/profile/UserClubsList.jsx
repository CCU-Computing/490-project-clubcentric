// frontend/src/components/profile/UserClubsList.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ClubCard from '../clubs/ClubCard'; // Your existing component
import Grid from '@mui/material/Grid'; // Import the MUI Box component

const UserClubsList = ({ clubs }) => {
    return (
        // We still use Tailwind for the outer "section"
        <section className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Clubs You're In
            </h3>
            
            {clubs.length > 0 ? (
                // Use an MUI Box for the layout of the cards
                <Grid container spacing={3}>
                    {clubs.map((club) => (
                        // Each card is wrapped in a <Grid item>
                        // This controls the width at different breakpoints
                        <Grid item key={club.id} xs={12} sm={6} md={4} lg={3}>
                            <ClubCard club={club} sx={{ height: '100%' }} />
                        </Grid>
                    ))}
                </Grid>

            ) : (
                // Your "Find a Club" message (this part is fine)
                <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-lg text-gray-700 mb-4">
                        You are not currently a member of any clubs.
                    </p>
                    <Link 
                        to="/club-search" //
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Find a New Club to Join
                    </Link>
                </div>
            )}
        </section>
    );
};

export default UserClubsList;