import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import axios from 'axios';

function Posts() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'housing',
    title: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ type: 'housing', title: '', description: '', price: '' });
      alert("Post created successfully");
    } catch (err) {
      alert('Error creating post: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create a Post
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="housing">Housing</MenuItem>
          <MenuItem value="book">Book</MenuItem>
          <MenuItem value="item">Item</MenuItem>
        </TextField>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Submit Post
        </Button>
      </form>
    </Box>
  );
}

export default Posts;
