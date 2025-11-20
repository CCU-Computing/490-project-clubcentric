import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';

export default function CreateClubModal({ open, onClose, onCreateClub }) {
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!clubName.trim()) {
      setError('Club name is required');
      return;
    }
    if (!clubDescription.trim()) {
      setError('Club description is required');
      return;
    }


    setIsSubmitting(true);
    
    try {
      await onCreateClub({
        name: clubName.trim(),
        description: clubDescription.trim(),
        
      });
      
      // Reset form and close modal on success
      setClubName('');
      setClubDescription('');
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create club. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setClubName('');
      setClubDescription('');
     
      setError('');
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
        Create a New Club
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            <TextField
              label="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              fullWidth
              required
              autoFocus
              disabled={isSubmitting}
              helperText={`${clubName.length}/50 characters`}
              inputProps={{ maxLength: 50 }}
            />
            
            <TextField
              label="Description"
              value={clubDescription}
              onChange={(e) => setClubDescription(e.target.value)}
              fullWidth
              required
              multiline
              rows={2}
              disabled={isSubmitting}
              helperText={`${clubDescription.length}/300 characters`}
              inputProps={{ maxLength: 300 }}
            />

            
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Club'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
