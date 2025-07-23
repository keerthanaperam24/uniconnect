import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('✅ Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.msg || 'Registration failed'));
    }
  };

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    },
    formWrapper: {
      backgroundColor: '#fff',
      padding: '2.5rem',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      width: '350px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    logo: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: '1rem',
      letterSpacing: '1px',
    },
    subtitle: {
      fontSize: '16px',
      marginBottom: '1.5rem',
      color: '#555',
    },
    input: {
      padding: '12px',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      width: '100%',
      fontSize: '16px',
    },
    button: {
      padding: '12px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%',
      fontSize: '16px',
      transition: 'background 0.3s',
    },
    message: {
      marginBottom: '1rem',
      color: '#444',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    footer: {
      marginTop: '1rem',
      fontSize: '14px',
      color: '#333',
    },
    link: {
      color: '#007bff',
      cursor: 'pointer',
      textDecoration: 'underline',
      marginLeft: '4px',
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.formWrapper}>
        <div style={styles.logo}>Uniconnect</div>
        <div style={styles.subtitle}>Create your student account</div>

        {message && <p style={styles.message}>{message}</p>}

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>

        <div style={styles.footer}>
          Already have an account?
          <span style={styles.link} onClick={() => navigate('/login')}>Login</span>
        </div>
      </form>
    </div>
  );
}

export default Register;
