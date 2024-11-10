import React, { useEffect, useState } from "react";
import { Box, Alert, Typography, Card, CardMedia, Grid, Button, TextField, CardActions, CircularProgress, Snackbar } from "@mui/material";
import { fetchData, postData, deleteData } from "../services/apiService";

const Popups = () => {
  const [popups, setPopups] = useState([]);
  const [file, setFile] = useState(null); // Single file for upload
  const [loading, setLoading] = useState(false);
  const [fetching, setfetching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    setfetching(true);
    try {
      const data = await fetchData("popups/get-popups");
      setPopups(data.data);
    } catch (error) {
        console.log(error.request.statusText);
        
      setErrorMessage(error.request.statusText);
    }finally{
        setfetching(false)
    }
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Handle a single file
  };

  const addPopup = async () => {
    if (!file) {
              setErrorMessage("Please select an image.");
              return;
            }
    setLoading(true);
    try {
      await postData("popups/add-popup", { photo: file }, {headers: { "Content-Type": "multipart/form-data" }});
      fetchPopups();
      setPopups(""); // Clear after successful upload
      setSuccessMessage("Popup added successfully!");
    } catch (error) {
      setErrorMessage("Error adding popup.");
    } finally {
      setLoading(false);
    }
  };


  
  const deletePopup = async (id) => {
    setDeleting(true);
    try {
      await deleteData(`popups/delete-popup/${id}`);
      fetchPopups();
      setSuccessMessage("Popup deleted successfully!");
    } catch (error) {
      setErrorMessage("Error deleting popup.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Popup Management
      </Typography>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: "10px" }}
      />
      <Button variant="contained" onClick={addPopup} disabled={!file || loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Image"}
      </Button>
      
      <Typography variant="h5">Popup Images</Typography>
      {fetching ? <CircularProgress size={24} color="inherit" />:""}
      <Grid container spacing={3} sx={{ mt: 2 }}>

        {popups.length === 0 ? (
          <Typography>No Popup images</Typography>
        ) : (
          popups.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={image.photo}
                  alt="popup image"
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() =>deletePopup(image._id)}
                  disabled={loading}
                >
                  {deleting ? <CircularProgress size={24} color="inherit" /> : "Delete"}
                </Button>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
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
        <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Popups;

// const Popups = () => {
//   const [popups, setPopups] = useState([]);
//   const [newPopup, setNewPopup] = useState(""); // Base64 image data
//   const [imageName, setImageName] = useState(""); // Image name or url if needed
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     fetchPopups();
//   }, []);

//   const fetchPopups = async () => {
//     try {
//       const data = await fetchData("popups/get-popups");
//       setPopups(data.data);
//     } catch (error) {
//         console.log(error.request.statusText);
        
//       setErrorMessage(error.request.statusText);
//     }
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setNewPopup(reader.result); // Store the base64 image string
//         setImageName(file.name); // Optionally store the name of the file
//       };
//       reader.readAsDataURL(file); // Convert image to data URL
//     }
//   };

//   const addPopup = async () => {
//     if (!newPopup) {
//       setErrorMessage("Please select an image.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       await postData("popups/add-popup", { photo: newPopup });
//       fetchPopups();
//       setNewPopup(""); // Clear after successful upload
//       setImageName(""); // Clear the file name
//       setSuccessMessage("Popup added successfully!");
//     } catch (error) {
//       setErrorMessage("Error adding popup.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deletePopup = async (id) => {
//     setIsLoading(true);
//     try {
//       await deleteData(`popups/delete-popup/${id}`);
//       fetchPopups();
//       setSuccessMessage("Popup deleted successfully!");
//     } catch (error) {
//       setErrorMessage("Error deleting popup.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Popup Management
//       </Typography>

//       <input
//         type="file"
//         accept="image/*"
//         style={{ display: "none" }}
//         id="popup-image-upload"
//         onChange={handleImageChange}
//       />

//       {newPopup && (
//         <TextField
//           label="Popup Image URL"
//           variant="outlined"
//           value={imageName}
//           onChange={(e) => setImageName(e.target.value)}
//           sx={{ mb: 2, width: '50%' }}
//           disabled
//         />
//       )}
      
//       <br />
//       <label htmlFor="popup-image-upload">
//         <Button variant="contained" component="span" disabled={isLoading}>
//           Select Image
//         </Button>
//       </label>
//       <br />
//       <br />

//       <Button variant="contained" onClick={addPopup} disabled={isLoading}>
//         {isLoading ? <CircularProgress size={24} color="inherit" /> : "Add Popup"}
//       </Button>

//       <Grid container spacing={3} sx={{ mt: 2 }}>
//         {popups.map((popup) => (
//           <Grid item xs={12} sm={6} md={4} key={popup._id}>
//             <Card>
//               <CardMedia
//                 component="img"
//                 height="140"
//                 image={popup.photo}
//                 alt="Popup image"
//               />
//               <CardActions>
//                 <Button size="small" color="error" onClick={() => deletePopup(popup._id)} disabled={isLoading}>
//                   {isLoading ? <CircularProgress size={24} color="inherit" /> : "Delete"}
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Success Snackbar */}
//       <Snackbar
//         open={!!successMessage}
//         autoHideDuration={3000}
//         onClose={() => setSuccessMessage("")}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: '100%' }}>
//           {successMessage}
//         </Alert>
//       </Snackbar>

//       {/* Error Snackbar */}
//       <Snackbar
//         open={!!errorMessage}
//         autoHideDuration={3000}
//         onClose={() => setErrorMessage("")}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: '100%' }}>
//           {errorMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Popups;
