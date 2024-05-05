import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { authStore } from '../../stores/auth_store/Store';

const API_URL = import.meta.env.VITE_API_URL;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function WorkoutsTable() {
  const { token } = authStore((state) => state);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${API_URL}/administration/workouts-details/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setWorkouts(response.data.workouts);
      } catch (error) {
        console.error("Failed to get workouts:", error);
      }
    };

    fetchWorkouts();
  }, [token]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Workout id</StyledTableCell>
              <StyledTableCell align="center">User</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Duration</StyledTableCell>
              <StyledTableCell align="center">Exercise</StyledTableCell>
              <StyledTableCell align="center">Picture</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
              <StyledTableRow key={workout.id}>
                <StyledTableCell align="center">{workout?.id}</StyledTableCell>
                <StyledTableCell align="center">{workout?.user?.username}</StyledTableCell>
                <StyledTableCell align="center">{workout?.date}</StyledTableCell>
                <StyledTableCell align="center">{workout?.duration}</StyledTableCell>
                <StyledTableCell align="center">{workout?.exercise}</StyledTableCell>
                <StyledTableCell align="center">{workout?.picture}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
