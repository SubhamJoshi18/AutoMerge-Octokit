import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import GitHubIcon from '@mui/icons-material/GitHub';
import FollowersIcon from '@mui/icons-material/Group';
import FollowingIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const octoToken = localStorage.getItem('githubtoken');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState({ private: [], public: [] });
  const [openRepoDialog, setOpenRepoDialog] = useState(false);

  useEffect(() => {
    if (!octoToken) {
      navigate('/');
    }
  }, [octoToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: { githubtoken: octoToken },
        });
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

  const handleViewRepo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/repo', {
        headers: { githubtoken: octoToken },
      });
      setRepo(response.data.data); // Assuming data format { private: [...], public: [...] }
      setOpenRepoDialog(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseRepoDialog = () => setOpenRepoDialog(false);

  const handleDeleteRepo = async (repoName, isPrivate) => {
    try {
      await axios.delete(`http://localhost:3000/api/repo/${repoName}`, {
        headers: { githubtoken: octoToken },
      });

      alert(`${repoName} Deleted Successfully`);
      setRepo((prevRepo) => ({
        ...prevRepo,
        [isPrivate ? 'private' : 'public']: prevRepo[
          isPrivate ? 'private' : 'public'
        ].filter((repo) => repo.name !== repoName),
      }));
    } catch (err) {
      console.error('Failed to delete repository:', err);
    }
  };

  if (loading)
    return (
      <CircularProgress style={{ display: 'block', margin: '50px auto' }} />
    );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
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
                <Button variant="outlined" onClick={handleViewRepo}>
                  {`${profileData.public_repos} View Repos`}
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </ProfileCard>

      {/* Dialog to show public and private repos */}
      <Dialog
        open={openRepoDialog}
        onClose={handleCloseRepoDialog}
        TransitionComponent={(props) => <Slide direction="up" {...props} />}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Repositories</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                width: '50%',
                padding: 2,
                borderRight: '1px solid #ccc',
                animation: 'fadeInLeft 1s ease-in-out',
              }}
            >
              <Typography variant="h6" color="primary">
                Public Repositories
              </Typography>
              {repo.public.map((repo) => (
                <Box
                  key={repo.id}
                  sx={{
                    marginY: 1,
                    padding: 1,
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant="subtitle1">{repo.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                    </a>
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDeleteRepo(repo.name, false)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                width: '50%',
                padding: 2,
                animation: 'fadeInRight 1s ease-in-out',
              }}
            >
              <Typography variant="h6" color="secondary">
                Private Repositories
              </Typography>
              {repo.private.map((repo) => (
                <Box
                  key={repo.id}
                  sx={{
                    marginY: 1,
                    padding: 1,
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant="subtitle1">{repo.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                    </a>
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDeleteRepo(repo.name, true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRepoDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileGithub;
