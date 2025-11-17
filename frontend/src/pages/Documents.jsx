import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@mui/material";

import {
  uploadDocument,
  getDocument,
  getManagers
} from "../services/documentService";

export default function DocumentsPage({ managerId }) {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  // -------------------------------
  // Load documents for the manager
  // -------------------------------
  const loadDocuments = async () => {
    const result = await getDocument(null, managerId);
    if (result) {
      setDocuments(result);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [managerId]);

  // -------------------------------
  // Document Upload
  // -------------------------------
  const handleUpload = async () => {
    if (!title || !file) return;

    const result = await uploadDocument(title, file, managerId);

    if (result) {
      await loadDocuments();
    }

    setTitle("");
    setFile(null);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Page Title */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 700, mb: 4 }}
        >
          Documents
        </Typography>

        {/* Upload Button */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            Upload Document
          </Button>
        </Box>

        {/* Documents Grid */}
        <Grid container spacing={3}>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Box
                  sx={{
                    background: "white",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    height: "100%",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {doc.title}
                  </Typography>

                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => window.open(doc.file_url, "_blank")}
                  >
                    View
                  </Button>
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                textAlign="center"
                variant="body1"
                color="text.secondary"
              >
                No documents found.
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Upload Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>Upload Document</DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button variant="contained" component="label">
              Choose File
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>

            {file && (
              <Typography sx={{ mt: 1, fontStyle: "italic" }}>
                Selected: {file.name}
              </Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button color="error" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
