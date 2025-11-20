// frontend/src/components/profile/UserInfoBlock.jsx

import React from 'react';
import { Avatar, Box, Paper, Typography } from '@mui/material';

const UserInfoBlock = ({ user }) => {
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
            }}>
                
                <Avatar
                    src={user.profile_picture}
                    alt={`${user.first_name} ${user.last_name}'s Profile`}
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
                            {user.first_name} {user.last_name}
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
                            {user.bio || 'This user has not set up a bio yet.'}
                        </Typography>
                    </Box>
                    
                </Box>
            </Box>
        </Paper>
    );
};

export default UserInfoBlock;