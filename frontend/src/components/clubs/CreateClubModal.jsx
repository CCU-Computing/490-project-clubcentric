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
  const [clubSummary, setClubSummary] = useState('');
  const [clubVideoEmbed, setClubVideoEmbed] = useState('');
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
    if (!clubSummary.trim()) {
      setError('Club summary is required');
      return;
    }
    if (clubName.length > 50) {
      setError('Club name must be 50 characters or less');
      return;
    }
    if (clubDescription.length > 300) {
      setError('Club description must be 300 characters or less');
      return;
    }
    if (clubSummary.length > 1000) {
      setError('Club summary must be 1000 characters or less');
      return;
    }
    if (clubVideoEmbed.length > 400) {
      setError('Video embed link must be 400 characters or less');
      return;
    }


    setIsSubmitting(true);
    
    try {
      await onCreateClub({
        name: clubName.trim(),
        description: clubDescription.trim(),
        summary: clubSummary.trim(),
        videoEmbed: clubVideoEmbed.trim()
      });
      
      // Reset form and close modal on success
      setClubName('');
      setClubDescription('');
      setClubSummary('');
      setClubVideoEmbed('');
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
      setClubSummary('');
      setClubVideoEmbed('');
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

            <TextField
              label="Club Summary"
              value={clubSummary}
              onChange={(e) => setClubSummary(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
              disabled={isSubmitting}
              helperText={`${clubSummary.length}/1000 characters`}
              inputProps={{ maxLength: 1000 }}
            />

            <TextField
              label="Video Embed Link (Optional)"
              value={clubVideoEmbed}
              onChange={(e) => setClubVideoEmbed(e.target.value)}
              fullWidth
              autoFocus
              disabled={isSubmitting}
              helperText={`${clubVideoEmbed.length}/400 characters`}
              inputProps={{ maxLength: 400 }}
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
