import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

export default function EditClubModal({ open, onClose, club, onUpdateClub }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [videoEmbed, setVideoEmbed] = useState("");
  const [tags, setTags] = useState("");
  const [links, setLinks] = useState("");
  const [lastMeetingDate, setLastMeetingDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset modal state whenever it opens
  useEffect(() => {
    if (open && club) {
      setName(club.name || "");
      setDescription(club.description || "");
      setSummary(club.summary || "");
      setVideoEmbed(club.videoEmbed || "");
      setTags(Array.isArray(club.tags) ? club.tags.join(" ") : "");
      setLinks(Array.isArray(club.links) ? club.links.join(" ") : "");
      setLastMeetingDate(club.lastMeetingDate || "");
      setError("");
    }
  }, [club, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !description.trim()) {
      setError("Name and description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateClub({
        club_id: club.id,
        name: name.trim(),
        description: description.trim(),
        summary: summary.trim(),
        videoEmbed: videoEmbed.trim(),
        tags: tags.split(" ").filter((t) => t.trim() !== ""),
        links: links.split(" ").filter((l) => l.trim() !== ""),
        lastMeetingDate: lastMeetingDate || null,
      });
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || "Failed to update club");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Club</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Club Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              multiline
              rows={3}
            />

            <TextField
              label="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Video Embed URL"
              value={videoEmbed}
              onChange={(e) => setVideoEmbed(e.target.value)}
              fullWidth
            />

            <TextField
              label="Tags (space-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              fullWidth
              helperText="Enter tags separated by spaces"
            />

            <TextField
              label="Links (space-separated)"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              fullWidth
              helperText="Enter links separated by spaces"
            />

            <TextField
              label="Last Meeting Date"
              type="date"
              value={lastMeetingDate || ""}
              onChange={(e) => setLastMeetingDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Club"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
