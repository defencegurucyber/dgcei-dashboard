import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, Button, CardActions } from "@mui/material";
import { fetchData, deleteData } from "../services/apiService";

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await fetchData("contacts/get-contact");
      setContacts(data.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await deleteData(`contacts/delete-contact/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact Us Management
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {contacts.map((contact) => (
          <Grid item xs={12} sm={6} md={4} key={contact._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{contact.name}</Typography>
                <Typography variant="body2">Email: {contact.email}</Typography>
                <Typography variant="body2">Phone: {contact.phone}</Typography>
                <Typography variant="body2">Message: {contact.message}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="error" onClick={() => deleteContact(contact._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Contact;
