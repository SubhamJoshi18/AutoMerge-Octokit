import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Fade,
  Alert,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import GitHub from '../../assets/github.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthGithub = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setAccessToken(event.target.value);
    setError(''); // Reset error on input change
  };

  const validateToken = () => {
    // Simple validation for the token length
    return accessToken.length > 10; // Adjust this condition as needed
  };

  const handleAuth = async () => {
    if (!validateToken()) {
      setError('Please enter a valid GitHub access token.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/token', {
        githubToken: accessToken,
      });

      localStorage.setItem('octoToken', response['data']['octoToken']);

      navigate('/profile'); // Navigate to the dashboard or desired page upon success
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Please check your token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {/* Left Side Image */}
      <Box
        component="img"
        src={GitHub} // Replace with your desired image URL
        alt="GitHub Logo"
        sx={{
          width: 300,
          height: 'auto',
          marginRight: 5,
          borderRadius: 2,
          boxShadow: 3,
        }}
      />

      {/* Right Side Authentication Form */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Fade in={true} timeout={1000}>
          <Typography variant="h4" component="h1" gutterBottom>
            <GitHubIcon fontSize="large" sx={{ mr: 1, color: '#333' }} />
            GitHub Auth
          </Typography>
        </Fade>

        <Fade in={true} timeout={1500}>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
            Enter your GitHub access token to authenticate.
          </Typography>
        </Fade>

        {error && (
          <Fade in={true} timeout={2000}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        <Fade in={true} timeout={2000}>
          <TextField
            label="GitHub Access Token"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            type="password"
            value={accessToken}
            onChange={handleChange}
            aria-label="GitHub Access Token" // Accessibility improvement
          />
        </Fade>

        <Fade in={true} timeout={2500}>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 3, py: 1, '&:hover': { bgcolor: 'primary.dark' } }} // Button hover effect
            startIcon={<GitHubIcon />}
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Authenticate'
            )}
          </Button>
        </Fade>
      </Box>
    </Box>
  );
};

export default AuthGithub;
