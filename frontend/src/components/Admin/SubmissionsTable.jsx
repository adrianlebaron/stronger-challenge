import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { authStore } from '../../stores/auth_store/Store';

const API_URL = import.meta.env.VITE_API_URL;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FF9671',
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

export default function SubmissionsTable() {
  const { token } = authStore((state) => state);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${API_URL}/challenges/challenge/admin/submissions/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setSubmissions(response.data["challenges submissions"]);
      } catch (error) {
        console.error("Failed to get submissions:", error);
      } finally {
        setLoading(false); // Set loading state to false when request completes
      }
    };

    fetchSubmissions();
  }, [token]);

  return (
    <div>
      {loading ? ( // Conditionally render loading message
        <Typography variant="h5" sx={{ textAlign: 'center', paddingTop: '50px' }}>Loading table...</Typography>
      ) : submissions.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Athlete</StyledTableCell>
                <StyledTableCell align="center">Title</StyledTableCell>
                <StyledTableCell align="center">Challenge</StyledTableCell>
                <StyledTableCell align="center">Deadline</StyledTableCell>
                <StyledTableCell align="center">Time</StyledTableCell>
                <StyledTableCell align="center">Amount</StyledTableCell>
                <StyledTableCell align="center">Details</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <StyledTableRow key={submission.id}>
                  <StyledTableCell align="center">{submission?.user.first_name} {submission?.user.last_name}</StyledTableCell>
                  <StyledTableCell align="center">{submission?.challenge.title}</StyledTableCell>
                  <StyledTableCell align="center">{submission?.challenge.summary}</StyledTableCell>
                  <StyledTableCell align="center">{submission?.challenge.deadline}</StyledTableCell>
                  <StyledTableCell align="center">{submission?.time}</StyledTableCell>
                  <StyledTableCell align="center">{submission?.amount}</StyledTableCell>
                  <StyledTableCell align="center">{submission?.details}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h5" sx={{textAlign: 'center', paddingTop: '50px'}}>There are no submissions yet</Typography>
      )}
    </div>
  );
}
