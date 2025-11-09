import PropTypes from 'prop-types';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CardActionArea 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function CreateClubCard({ onClick }) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        width: 350,
        maxWidth: '100%',
        border: '2px dashed',
        borderColor: 'primary.main',
        bgcolor: 'primary.50',
      }}
    >
      <CardActionArea 
        onClick={onClick} 
        sx={{ 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <AddIcon 
              sx={{ 
                fontSize: 64, 
                color: 'primary.main',
              }} 
            />
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              Create a Club
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              Start your own club and bring people together
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
