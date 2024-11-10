import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Card, CardContent, Grid, Button, 
  TextField, CardActions, CardMedia, Snackbar, Alert, CircularProgress 
} from "@mui/material";
import { fetchData, postData, deleteData } from "../services/apiService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    descrption: "",
    discountPrice: "",
    actualPrice: "",
    discount: "",
    mode: "",
    startFrom: "",
    addmissionCloseDate: ""
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetchData("courses/get-course");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setErrorMessage("Failed to fetch courses");
    }
  };

  const handleFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  const addCourse = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("descrption", newCourse.descrption);
      formData.append("discountPrice", newCourse.discountPrice);
      formData.append("actualPrice", newCourse.actualPrice);
      formData.append("discount", newCourse.discount);
      formData.append("mode", newCourse.mode);
      formData.append("startFrom", newCourse.startFrom);
      formData.append("addmissionCloseDate", newCourse.addmissionCloseDate);

      if (bannerFile) {
        formData.append("photo", bannerFile);
      }

      await postData("courses/add-course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Course added successfully!");
      fetchCourses();
      setNewCourse({
        title: "",
        descrption: "",
        discountPrice: "",
        actualPrice: "",
        discount: "",
        mode: "",
        startFrom: "",
        addmissionCloseDate: ""
      });
      setBannerFile(null);
    } catch (error) {
      console.error("Error adding course:", error);
      setErrorMessage("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteData(`courses/delete-course/${id}`);
      fetchCourses();
      setSuccessMessage("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      setErrorMessage("Failed to delete course");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Courses Management
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Input Fields */}
        {["title", "descrption", "discountPrice", "actualPrice", "discount", "mode"].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              variant="outlined"
              value={newCourse[field]}
              onChange={(e) => setNewCourse({ ...newCourse, [field]: e.target.value })}
              fullWidth
            />
          </Grid>
        ))}

        <Grid item xs={12} sm={6}>
          <TextField
            label="Start From"
            type="date"
            variant="outlined"
            value={newCourse.startFrom}
            onChange={(e) => setNewCourse({ ...newCourse, startFrom: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Admission Close Date"
            type="date"
            variant="outlined"
            value={newCourse.addmissionCloseDate}
            onChange={(e) => setNewCourse({ ...newCourse, addmissionCloseDate: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* File Input */}
        <Grid item xs={12}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={addCourse} disabled={loading || !bannerFile}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Add Course"}
          </Button>
        </Grid>
      </Grid>

<h3>Courses</h3>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={course.banner}
                alt="Course banner"
              />
              <CardContent>
                <Typography variant="h5">{course.title}</Typography>
                <Typography variant="body2">{course.descrption}</Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> {course.actualPrice} | <strong>Discounted:</strong> {course.discountPrice}
                </Typography>
                <Typography variant="body2">
                  <strong>Mode:</strong> {course.mode}
                </Typography>
                <Typography variant="body2">
                  <strong>Start Date:</strong> {new Date(course.startFrom).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="error" onClick={() => deleteCourse(course._id)}>
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

export default Courses;
