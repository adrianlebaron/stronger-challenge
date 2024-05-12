import { Paper, Grid, Button, Typography, Box } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import { authStore } from '../../stores/auth_store/Store';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../index.css'
import { toast } from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = import.meta.env.VITE_API_URL;

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function GetAdminChallenges() {
    const { token } = authStore((state) => state);
    const [challenges, setChallenges] = useState([])

    const deleteChallenge = async (challengeId) => {
        toast((t) => (
            <span>
                <Typography  variant="h5" gutterBottom>Are you sure you want to delete this <b>challenge?</b></Typography>
                <Button
                    color='error' 
                    size='small' 
                    variant='contained'
                    onClick={() => {
                        toast.dismiss(t.id);
                        deleteChallengeInternal(challengeId);
                    }}
                >
                    Yes, delete
                </Button>
                <Button 
                    onClick={() => toast.dismiss(t.id)} 
                    color='secondary' 
                    size='small' 
                    variant='contained'
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

            setChallenges(challenges.filter((challenge) => challenge.id!== challengeId));

            toast.success('Challenge deleted successfully');
        } catch (error) {
            console.error('Error deleting challenge:', error);
            toast.error('Error deleting challenge');
        }
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

    return (
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
                                <Button variant='outlined'>
                                    Edit
                                </Button>
                                <Button variant='outlined' onClick={() => deleteChallenge(challenge.id)} startIcon={<DeleteIcon />}>
                                    Delete
                                </Button>
                            </Grid>
                        </Item>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
