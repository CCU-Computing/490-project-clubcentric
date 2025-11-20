import { useEffect, useState } from "react";
import { get_club, create_club } from "../services/clubService";
import ClubCard from "../components/cards/ClubCard";
import CreateClubCard from "../components/clubs/CreateClubCard";
import CreateClubModal from "../components/clubs/CreateClubModal";
import { 
  TextField, 
  InputAdornment, 
  Container, 
  Typography, 
  Box,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    get_club().then(data => {
      if (data) setClubs(data);

      
    });
  }, []);

  // Filter clubs based on search query, name, description, and tags.
  // Supports multiple keywords separated by a comma or a space.
  const filteredClubs = clubs.filter(club => {
    // If search is empty, show all clubs
    if (!searchQuery.trim()) return true;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    const keywords = normalizedQuery.split(/[\s,]+/)
      .filter(keyword => keyword.length > 0);

    if (keywords.length === 0) return true;

    // Check if any keyword is included in the club's name or tags
    return keywords.some(keyword => {
      const nameMatch = club.name.toLowerCase().includes(keyword);
      const clubTagsString = club.tags 
        ? (Array.isArray(club.tags) ? club.tags.join(' ') : club.tags).toLowerCase() 
        : '';
      const tagsMatch = clubTagsString.includes(keyword);

      return nameMatch || tagsMatch;
    });
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateClub = async (clubData) => {
    const result = await create_club(clubData.name, clubData.description, clubData.summary, clubData.videoEmbed);
    if (result) {
      // refresh the clubs list
      const updatedClubs = await get_club();
      if (updatedClubs) setClubs(updatedClubs);
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}
        >
          Clubs
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            // Updated placeholder for new search functionality
            placeholder="Search clubs by name, description, or tags (use comma or space for multiple keywords)..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ maxWidth: 600 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Clubs Grid */}
        <Grid container spacing={3}>
          {/* Create Club Card - only show if no search query */}
          {!searchQuery && (
            <Grid item xs={12} sm={6} md={4}>
              <CreateClubCard onClick={handleOpenModal} />
            </Grid>
          )}
          
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club) => (
              <Grid item xs={12} sm={6} md={4} key={club.id}>
                <ClubCard club={club} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ textAlign: 'center', mt: 4 }}
              >
                {searchQuery ? 'No clubs found matching your search.' : 'No clubs available.'}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Create Club Modal */}
        <CreateClubModal 
          open={isModalOpen}
          onClose={handleCloseModal}
          onCreateClub={handleCreateClub}
        />
      </Container>
    </Box>
  );
}