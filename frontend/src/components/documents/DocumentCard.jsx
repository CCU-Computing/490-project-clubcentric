import { Card, CardContent, Typography, CardActionArea } from "@mui/material";

export default function DocumentCard({ document }) {
  const handleClick = () => {
    // Add navigation when you create a "Document Details" page
    console.log("Clicked document:", document.id);
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {document.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {document.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
