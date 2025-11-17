import { Card, CardContent, Typography, CardActionArea } from "@mui/material";

export default function CreateDocumentCard({ onClick }) {
  return (
    <Card
      sx={{
        height: "100%",
        border: "2px dashed #888",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            + Create Document
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new document to the system.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
