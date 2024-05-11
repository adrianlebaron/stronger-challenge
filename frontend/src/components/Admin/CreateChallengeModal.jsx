import { useState } from 'react';
import { Backdrop, Box, Modal, Fade, Button, Typography, Stack, FormControl, InputLabel, TextField, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { authStore } from "../../stores/auth_store/Store";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { DateTime } from "luxon";

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

export default function CreateChallengeModal() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [repeat, setRepeat] = useState('');
    const [response, setResponse] = useState('');
    const [deadline, setDeadline] = useState(null);
    const { token } = authStore((state) => state);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        const formattedDeadline = DateTime.fromISO(deadline).toFormat("yyyy-MM-dd");

        axios.post(
            `${API_URL}/challenges/challenge/admin/`,
            {
                type: "Create",
                challenge: {
                    title: title,
                    summary: summary,
                    repeat: repeat,
                    response: response,
                    deadline: formattedDeadline,
                }
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        ).then(() => {
            toast.success("Challenge Created! 🥵");
            handleClose();
        }).catch(error => {
            console.error('Error creating challenge:', error);
        })
    }

    return (
        <div>
            <Button onClick={handleOpen} color='secondary' variant='contained'>Create new challenge</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
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
                                <Typography variant="h4">Create a new challenge</Typography>
                            </Stack>
                            <FormControl variant="standard">
                                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
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
                                    <MenuItem value="never">Never</MenuItem>
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                    <MenuItem value="bi-weekly">Bi-weekly</MenuItem>
                                    <MenuItem value="bi-monthly">Bi-monthly</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
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
                                    <MenuItem value="amount">Amount</MenuItem>
                                    <MenuItem value="time">Time</MenuItem>
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
                                    Save Changes
                                </Button>
                            </FormControl>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
