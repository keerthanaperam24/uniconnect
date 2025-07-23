import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Box, Typography, TextField, Button, Chip, Alert } from '@mui/material';

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [],
    interests: [],
    newSkill: '',
    newInterest: '',
  });
  const [error, setError] = useState(null);
  const isOwnProfile = !userId; // If no userId, it's the logged-in user's profile

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        if (isOwnProfile) {
          const decoded = jwtDecode(token);
          setUser(decoded);
          setFormData({
            name: decoded.name || '',
            email: decoded.email || '',
            skills: decoded.skills || [],
            interests: decoded.interests || [],
            newSkill: '',
            newInterest: '',
          });
        } else {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(res.data);
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
            skills: res.data.skills || [],
            interests: res.data.interests || [],
            newSkill: '',
            newInterest: '',
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.response?.data?.msg || 'Error loading profile');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUser();
  }, [navigate, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (formData.newSkill && !formData.skills.includes(formData.newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.newSkill],
        newSkill: '',
      });
    }
  };

  const addInterest = () => {
    if (formData.newInterest && !formData.interests.includes(formData.newInterest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, formData.newInterest],
        newInterest: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwnProfile) return; // Prevent editing other users' profiles
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/profile`,
        { name: formData.name, skills: formData.skills, interests: formData.interests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('token', res.data.token);
      setUser(jwtDecode(res.data.token));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating profile');
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {isOwnProfile ? 'Your Profile' : `${user.name}'s Profile`}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          disabled={!isOwnProfile}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          disabled
          fullWidth
        />
        <Box>
          <Typography variant="h6">Skills</Typography>
          {isOwnProfile && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Add Skill"
                name="newSkill"
                value={formData.newSkill}
                onChange={handleChange}
                size="small"
              />
              <Button variant="contained" onClick={addSkill}>Add</Button>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={isOwnProfile ? () => setFormData({
                  ...formData,
                  skills: formData.skills.filter((_, i) => i !== index),
                }) : undefined}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="h6">Interests</Typography>
          {isOwnProfile && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Add Interest"
                name="newInterest"
                value={formData.newInterest}
                onChange={handleChange}
                size="small"
              />
              <Button variant="contained" onClick={addInterest}>Add</Button>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.interests.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                onDelete={isOwnProfile ? () => setFormData({
                  ...formData,
                  interests: formData.interests.filter((_, i) => i !== index),
                }) : undefined}
              />
            ))}
          </Box>
        </Box>
        {isOwnProfile && <Button type="submit" variant="contained">Save</Button>}
      </Box>
    </Box>
  );
}

export default Profile;