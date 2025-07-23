import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

function ProjectBoard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '' });

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
     await axios.post(`${process.env.REACT_APP_API_URL}/api/projects`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ title: '', description: '' });
      alert("Project created successfully");
    } catch (err) {
      alert('Error creating project: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create a Project
      </Typography>

      <form onSubmit={handleSubmit}>
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
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Submit Project
        </Button>
      </form>
    </Box>
  );
}

export default ProjectBoard;
