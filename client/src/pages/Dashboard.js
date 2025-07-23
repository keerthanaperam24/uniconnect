import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { Box, Typography, List, ListItem, Card, CardContent, CardActions, Button, Chip } from '@mui/material';

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const postsRes = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projectsRes = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data);
        setProjects(projectsRes.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching data');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Typography variant="h5" gutterBottom>Recent Posts</Typography>
      <List>
        {posts.length === 0 ? (
          <Typography>No posts available</Typography>
        ) : (
          posts.map((post) => (
            <ListItem key={post._id} sx={{ mb: 2 }}>
              <Card sx={{ width: '100%', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Posted by:{' '}
                    <Button
                      color="primary"
                      sx={{ textTransform: 'none', p: 0 }}
                      onClick={() => handleProfileClick(post.userId._id)}
                    >
                      {post.userId.name}
                    </Button>
                  </Typography>
<Typography variant="caption" sx={{ backgroundColor: 'primary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, display: 'inline-block', width: 80, textAlign: 'center', textTransform: 'capitalize' }}>{post.type}</Typography>
                  <Typography variant="body2" paragraph>{post.description || 'No description'}</Typography>
                  {post.price && (
                    <Typography variant="body2" color="text.secondary">
                      Price: ${post.price}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Posted on: {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>

              </Card>
            </ListItem>
          ))
        )}
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Recent Projects</Typography>
      <List>
        {projects.length === 0 ? (
          <Typography>No projects available</Typography>
        ) : (
          projects.map((project) => (
            <ListItem key={project._id} sx={{ mb: 2 }}>
              <Card sx={{ width: '100%', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{project.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created by:{' '}
                    <Button
                      color="primary"
                      onClick={() => handleProfileClick(project.userId._id)}
                      sx={{ textTransform: 'none', p: 0 }}
                    >
                      {project.userId.name}
                    </Button>
                  </Typography>
                  <Typography variant="body2" paragraph>{project.description || 'No description'}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created on: {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>

              </Card>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}

export default Dashboard;