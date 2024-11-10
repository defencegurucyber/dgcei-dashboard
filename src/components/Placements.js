import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Grid, Button, TextField, Snackbar, Alert, CircularProgress 
} from "@mui/material";
import { fetchData, postData, deleteData } from "../services/apiService";
import PlacementCard from "./PlacementCard";

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [newPlacement, setNewPlacement] = useState({ name: "", position: "", company: "", package: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const res = await fetchData("placements/get-placement");
      const sortedData = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setPlacements(sortedData);
    } catch (error) {
      setErrorMessage("Failed to fetch placements");
      console.error("Error fetching placements:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const addPlacement = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("stu_name", newPlacement.name);
      formData.append("position", newPlacement.position);
      formData.append("comp_name", newPlacement.company);
      formData.append("pkg", newPlacement.package);

      await postData("placements/add-placement", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Placement added successfully!");
      fetchPlacements();
      setNewPlacement({ name: "", position: "", company: "", package: "" });
      setFile(null);
    } catch (error) {
      setErrorMessage("Failed to add placement");
      console.error("Error adding placement:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlacement = async (id) => {
    try {
      await deleteData(`placements/delete-placement/${id}`);
      setSuccessMessage("Placement deleted successfully!");
      fetchPlacements();
    } catch (error) {
      setErrorMessage("Failed to delete placement");
      console.error("Error deleting placement:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Placement Management
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            value={newPlacement.name}
            onChange={(e) => setNewPlacement({ ...newPlacement, name: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Position"
            variant="outlined"
            value={newPlacement.position}
            onChange={(e) => setNewPlacement({ ...newPlacement, position: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Company"
            variant="outlined"
            value={newPlacement.company}
            onChange={(e) => setNewPlacement({ ...newPlacement, company: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Package"
            variant="outlined"
            value={newPlacement.package}
            onChange={(e) => setNewPlacement({ ...newPlacement, package: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <input type="file" onChange={handleFileChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={addPlacement} disabled={!file ||loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Add Placement"}
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h5" sx={{ mt: 3 }}>
        Placements
      </Typography>
      <Grid container spacing={3}>
        {placements.map((placement) => (
          <Grid item key={placement._id} xs={12} sm={6} md={4}>
            <PlacementCard placement={placement} onDelete={deletePlacement} />
          </Grid>
        ))}
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Placements;
