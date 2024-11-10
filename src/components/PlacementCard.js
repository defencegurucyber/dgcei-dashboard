import React from "react";
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box } from "@mui/material";

const PlacementCard = ({ placement, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={placement.photo}
        alt={`${placement.stu_name}'s placement`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {placement.stu_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Position:</strong> {placement.position}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Company:</strong> {placement.comp_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Package:</strong> {placement.pkg}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Updated At:</strong> {new Date(placement.updatedAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="error" onClick={() => onDelete(placement._id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlacementCard;
