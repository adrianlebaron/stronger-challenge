import { useState, useEffect } from 'react';
import CreateChallengeModal from "./CreateChallengeModal";
import EditChallengeModal from "./EditChallengeModal";
import { Paper, Grid, Button, Typography, Box } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import { authStore } from '../../stores/auth_store/Store';
import axios from 'axios';
import '../../index.css'
import { toast } from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'

const API_URL = import.meta.env.VITE_API_URL;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

function AdminChallenge() {
  const { token } = authStore((state) => state);
  const [challenges, setChallenges] = useState([]);
  const [selectedChallengeData, setSelectedChallengeData] = useState(null); // State to hold selected challenge data

  const deleteChallenge = async (challengeId) => {
    toast((t) => (
      <span>
        <Typography variant="h5" gutterBottom>Are you sure you want to delete this <b>challenge?</b></Typography>
        <Button
          color='error'
          size='small'
          variant='contained'
          onClick={() => {
            toast.dismiss(t.id);
            deleteChallengeInternal(challengeId);
          }}
          spacing={2}
        >
          Yes, delete
        </Button>
        <Button
          onClick={() => toast.dismiss(t.id)}
          color='secondary'
          size='small'
          variant='contained'
          sx={{marginLeft: '55px'}}
        >
          Cancel
        </Button>
      </span>
    ), {
      duration: 10000,
    });
  };

  const deleteChallengeInternal = async (challengeId) => {
    try {
      await axios.post(
        `${API_URL}/challenges/challenge/admin/`,
        {
          type: 'Delete',
          challenge: {
            id: challengeId,
          },
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setChallenges(challenges.filter((challenge) => challenge.id !== challengeId));

      toast.success('Challenge deleted successfully');
    } catch (error) {
      console.error('Error deleting challenge:', error);
      toast.error('Error deleting challenge');
    }
  };

  const handleEditChallenge = (challengeData) => {
    setSelectedChallengeData(challengeData); // Set the selected challenge data when user clicks "Edit"
  };

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`${API_URL}/challenges/challenge/admin/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setChallenges(response.data.challenges);
      } catch (error) {
        console.error("Failed to get challenges:", error);
      }
    };

    fetchChallenges();
  }, [token]);

  const handleCloseEditModal = () => {
    setSelectedChallengeData(null); // Reset selected challenge data when modal is closed
  };

  return (
    <div>
      <CreateChallengeModal /> <br />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {challenges.map((challenge) => (
            <Grid item xs={2} sm={4} md={4} key={challenge.id}>
              <Item>
                <Typography variant="subtitle1">
                  {challenge.title}
                </Typography>
                <Typography >
                  {challenge.summary}
                </Typography>
                <Typography>
                  Repetition: {challenge.repeat}
                </Typography>
                <Typography>
                  Users response type: {challenge.response}
                </Typography>
                <Typography>
                  Deadline: {challenge.deadline}
                </Typography>
                <Grid item>
                  <Button variant='outlined' onClick={() => handleEditChallenge(challenge)} startIcon={<EditIcon />} spacing={2}>
                    Edit
                  </Button>
                  <Button variant='outlined' onClick={() => deleteChallenge(challenge.id)} startIcon={<DeleteIcon />} spacing={2}>
                    Delete
                  </Button>
                </Grid>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Render EditChallengeModal if selectedChallengeData is not null */}
      {selectedChallengeData && (
        <EditChallengeModal
          challengeData={selectedChallengeData}
          token={token}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  )
}

export default AdminChallenge;
