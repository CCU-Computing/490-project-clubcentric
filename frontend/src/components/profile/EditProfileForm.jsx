import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Paper, Typography } from '@mui/material';

/**
 * Form for editing user profile information (first_name, last_name, bio).
 */
const EditProfileForm = ({ user, onUpdate, onCancel }) => {
    
    // Initialize state with current user data, defaulting to empty string
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the parent handler with the updated form data
        onUpdate(formData);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                Edit Profile
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name (Optional)"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name (Optional)"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Bio (Optional)"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                        />
                    </Grid>
                    
                    {/* Display uneditable fields for context */}
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                            Username: @{user.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: {user.email}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ backgroundColor: '#14B8A6', '&:hover': { backgroundColor: '#0D9488' } }}
                        >
                            Update Profile
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default EditProfileForm;