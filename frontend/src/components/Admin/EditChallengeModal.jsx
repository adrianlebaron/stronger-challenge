import { useState } from 'react';
import { Backdrop, Box, Modal, Fade, Button, Typography, Stack, FormControl, InputLabel, TextField, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { DateTime } from "luxon";
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_API_URL;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

EditChallengeModal.propTypes = {
    challengeData: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    onClose: PropTypes.func,
  };


export default function EditChallengeModal({ challengeData, token, onClose }) {
    const [open] = useState(true);
    const [title, setTitle] = useState(challengeData.title);
    const [summary, setSummary] = useState(challengeData.summary);
    const [repeat, setRepeat] = useState(challengeData.repeat);
    const [response, setResponse] = useState(challengeData.response);
    const [deadline, setDeadline] = useState(DateTime.fromISO(challengeData.deadline));

    const handleSubmit = () => {
        const formattedDeadline = deadline.toFormat("yyyy-MM-dd");
        axios.post(
            `${API_URL}/challenges/challenge/admin/`,
            {
                type: "Edit",
                challenge: {
                    id: challengeData.id,
                    title: title,
                    summary: summary,
                    repeat: repeat,
                    response: response,
                },
                deadline: formattedDeadline,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        ).then(() => {
            toast.success("Challenge Edited!");
            onClose();
            setTimeout(function() {
                location.reload();
            }, 1000);
        }).catch(error => {
            console.error('Error editing challenge:', error);
        })
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Stack spacing={2} width={'90%'}>
                            <Stack spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h4">Edit challenge</Typography>
                            </Stack>
                            <FormControl variant="standard">
                                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </FormControl>
                            <FormControl variant="standard">
                                <TextField label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} required/>
                            </FormControl>
                            <FormControl>
                                <InputLabel>Repeat</InputLabel>
                                <Select
                                    value={repeat}
                                    onChange={(e) => setRepeat(e.target.value)}
                                    label="Repeat"
                                    required
                                >
                                    <MenuItem value="Never">Never</MenuItem>
                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                    <MenuItem value="Bi-Weekly">Bi-weekly</MenuItem>
                                    <MenuItem value="Bi-Monthly">Bi-monthly</MenuItem>
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>User response</InputLabel>
                                <Select
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    label="User response"
                                    required
                                >
                                    <MenuItem value="Amount">Amount</MenuItem>
                                    <MenuItem value="Time">Time</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterLuxon}>
                                    <DatePicker label="Deadline Date" value={deadline} onChange={(date) => setDeadline(date)} required/>
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl>
                            </FormControl>
                            <FormControl variant="standard">
                                <Button onClick={handleSubmit} sx={{ alignSelf: 'center' }} variant="contained" size="medium" color="secondary">
                                    Save changes
                                </Button>
                            </FormControl>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
