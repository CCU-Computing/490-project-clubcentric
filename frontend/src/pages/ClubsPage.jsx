import { useEffect, useState } from "react";
import { get_club, create_club } from "../services/clubService";
import ClubCard from "../components/clubs/ClubCard";
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

  // Filter clubs based on search query
  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Search clubs by name or description..."
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
