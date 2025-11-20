import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardActionArea
} from '@mui/material';
// import GroupIcon from '@mui/icons-material/Group'; // Unused

export default function ClubCard({ club }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/club/${club.id}`);
  };

  // FIX: Use live data. If club.tags is null/undefined, fallback to empty array.
  const clubTags = club.tags || [];

  return (
    <Card
      sx={{
        height: '100%',
        width: 350,
        maxWidth: '100%',
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Club Name */}
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 2
            }}
          >
            {club.name}
          </Typography>

          {/* Tags - Only render Box if tags exist */}
          {clubTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {clubTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
              ))}
            </Box>
          )}

          {/* Club Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.6
            }}
          >
            {club.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

ClubCard.propTypes = {
  club: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};