import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  CircularProgress,
  Tooltip,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import GitHubIcon from '@mui/icons-material/GitHub';
import FollowersIcon from '@mui/icons-material/Group';
import FollowingIcon from '@mui/icons-material/PersonAdd';

const ProfileCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  padding: theme.spacing(3),
  animation: 'fadeIn 1.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}));

const ProfileGithub = () => {
  const navigate = useNavigate();
  const octoToken = localStorage.getItem('octoToken');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!octoToken) {
      navigate('/');
    }
  }, [octoToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            octoToken: octoToken,
          },
        });
        console.log(response.data);
        setProfileData(response.data.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [octoToken]);

  const handleLogout = () => {
    localStorage.removeItem('octoToken');
    navigate('/');
  };

  if (loading)
    return (
      <CircularProgress style={{ display: 'block', margin: '50px auto' }} />
    );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Ensure elements stack vertically
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <ProfileCard>
        <CardHeader
          avatar={
            <Avatar
              src={profileData.avatar_url}
              sx={{ width: 80, height: 80 }}
            />
          }
          title={<Typography variant="h5">{profileData.login}</Typography>}
          subheader={`GitHub User ID: ${profileData.id}`}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<GitHubIcon />}
                href={profileData.html_url}
                target="_blank"
                sx={{ animation: 'fadeInUp 1s ease-in-out', marginRight: 1 }}
              >
                View GitHub
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="body2" color="textSecondary">
            <strong>Created at:</strong>{' '}
            {new Date(profileData.created_at).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Updated at:</strong>{' '}
            {new Date(profileData.updated_at).toLocaleDateString()}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Tooltip title="Followers">
                <Chip
                  icon={<FollowersIcon />}
                  label={`${profileData.followers} Followers`}
                  variant="outlined"
                  color="primary"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="Following">
                <Chip
                  icon={<FollowingIcon />}
                  label={`${profileData.following} Following`}
                  variant="outlined"
                  color="secondary"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="Public Repos">
                <Chip
                  label={`${profileData.public_repos} Public Repos`}
                  color="default"
                  variant="outlined"
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Private Repos: {profileData.total_private_repos}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Disk Usage: {Math.round(profileData.disk_usage / 1024)} KB
            </Typography>
          </Box>
        </CardContent>
      </ProfileCard>
    </Box>
  );
};

export default ProfileGithub;
