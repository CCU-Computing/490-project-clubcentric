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
  getDocument
} from "../services/documentService";

import "../components/DocumentsPage.css";

export default function DocumentsPage({ managerId }) {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const loadDocuments = async () => {
    const result = await getDocument(null, managerId);
    if (result) {
      setDocuments(result);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [managerId]);

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
    <div className="documents-page">
      <Container maxWidth="md">
        
        {/* Page Title */}
        <Typography className="documents-title">
          Documents
        </Typography>

        {/* Upload Button */}
        <div className="upload-section">
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            Upload Document
          </Button>
        </div>

        {/* Documents Grid */}
        <Grid container spacing={3}>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <div className="document-card">
                  <Typography className="document-title">
                    {doc.title}
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => window.open(doc.file_url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography className="no-documents">
                No documents found.
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Upload Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>Upload Document</DialogTitle>

          <DialogContent>
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
              <Typography className="modal-file-name">
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
    </div>
  );
}
