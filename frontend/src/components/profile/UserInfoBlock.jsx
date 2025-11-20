import React from 'react';
import { Avatar, Box, Paper, Typography, Button } from '@mui/material';
import EditProfileForm from './EditProfileForm';

/**
 * Displays user profile information or the edit form.
 */
const UserInfoBlock = ({ user, isEditing, setIsEditing, handleUpdate }) => {

    // Fallback/Placeholder for optional fields
    const firstName = user.first_name || 'First Name Not Set';
    const lastName = user.last_name || 'Last Name Not Set';
    // const bioText = user.bio || 'This user has not set up a bio yet.';
    const bioText = user.bio;

    // Construct the full name for display, handling cases where one or both names are missing.
    const fullName = (user.first_name || user.last_name)
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
        : '';

    // RENDER EDIT FORM
    if (isEditing) {
        return (
            <EditProfileForm
                user={user}
                onUpdate={handleUpdate}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    // RENDER STATIC INFO BLOCK
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                mb: 4,
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3,
                position: 'relative' // For the Edit Profile button positioning
            }}>

                <Avatar
                    src={user.profile_picture}
                    alt={`${firstName} ${lastName}'s Profile`}
                    sx={{
                        width: 160,
                        height: 160,
                        flexShrink: 0,
                        border: '4px solid',
                        borderColor: '#14B8A6',
                    }}
                />

                <Box sx={{ flexGrow: 1 }}>

                    <Box sx={{ mb: 2 }}>

                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{ fontWeight: 600 }}
                            color="text.primary"
                        >
                            {fullName}
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            @{user.username}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#0D9488',
                                mt: 0.5
                            }}
                        >
                            {user.email}
                        </Typography>
                    </Box>

                    {bioText && (
                        <Box>
                            <Typography
                                variant="h6"
                                component="h3"
                                color="text.primary"
                                sx={{ fontWeight: 500 }}
                            >
                                Bio
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                {bioText}
                            </Typography>
                        </Box>
                    )}

                </Box>

                {/* Edit Profile Button */}
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsEditing(true)}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        color: '#14B8A6',
                        borderColor: '#14B8A6',
                        '&:hover': {
                            borderColor: '#0D9488',
                            backgroundColor: '#E0F2F1'
                        }
                    }}
                >
                    Edit Profile
                </Button>

            </Box>
        </Paper>
    );
};

export default UserInfoBlock;