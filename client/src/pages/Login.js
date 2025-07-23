import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('API URL:', baseURL);

      const res = await axios.post(
        `${baseURL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // 🔥 CORS-safe fix
      );

      localStorage.setItem('token', res.data.token);
      if (onLogin) onLogin();
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.msg || err.message));
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
        <div style={styles.subtitle}>Student Login</div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        <div style={styles.footer}>
          Not a member?
          <span style={styles.link} onClick={() => navigate('/register')}>Sign up</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
