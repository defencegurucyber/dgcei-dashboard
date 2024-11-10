import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button, CardActions, Snackbar, Alert, CircularProgress } from "@mui/material";
import { fetchData, postData, deleteData } from "../services/apiService";

const Gallary = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // To track uploaded images
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchGallary();
  }, []);

  const fetchGallary = async () => {
    try {
      const data = await fetchData("gallary/get-gallary");
      setImages(data.data);
    } catch (error) {
      setErrorMessage("Error fetching gallery images.");
      console.error("Error fetching gallery:", error);
    }
  };

  const handleFilesChange = (e) => {
    setFiles(e.target.files);
  };

  const addImages = async () => {
    setLoading(true);
    setUploadProgress(0);
    const totalFiles = files.length;
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("photo", file); // `photo` should match your backend multer field name
      });

      // Upload multiple images in a single API call
      await postData("gallary/add-gallary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      setSuccessMessage(`${totalFiles} images uploaded successfully!`);
      fetchGallary();
      setFiles([]); // Clear file input
    } catch (error) {
      setErrorMessage("Failed to upload images.");
      console.error("Error adding images:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    try {
      await deleteData(`gallary/delete-gallary-image/${id}`);
      setSuccessMessage("Image deleted successfully!");
      fetchGallary();
    } catch (error) {
      setErrorMessage("Failed to delete image.");
      console.error("Error deleting image:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gallery Management
      </Typography>
      <input
        type="file"
        multiple
        onChange={handleFilesChange}
        style={{ marginBottom: "10px" }}
      />
      <Button variant="contained" onClick={addImages} disabled={files.length === 0 || loading}>
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Upload Images"
        )}
      </Button>
      {loading && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Uploading {uploadProgress}% of {files.length} images.
        </Typography>
      )}
      <Typography variant="h5">Gallary Images</Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        
        {
        images.length===0?"No gallary images":images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image.photo}
                alt="Gallery image"
              />
              <CardContent>
                <Typography variant="body2">Gallery Item</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="error" onClick={() => deleteImage(image._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
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

export default Gallary;
