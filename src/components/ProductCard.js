import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {

  const {name,cost,rating,image,_id} = product


  return (
    <Card className="card" sx={{height:"100%"}}>
      <CardMedia
        component="img"
        alt={name}
        height="160"
        image={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
          ${cost}
        </Typography>
        
        <Rating name="read-only" value={rating} readOnly />
      
      </CardContent>
      <CardActions className="card-actions">
        <Button className="card-button" variant="contained" value={_id} startIcon={<AddShoppingCartOutlined/>} onClick={handleAddToCart}>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
