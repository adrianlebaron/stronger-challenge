import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

export default function CustomizedTables() {
  const { token } = authStore((state) => state);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/administration/users-admin/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to get users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right">Name</StyledTableCell>
            <StyledTableCell align="right">Username</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
            <StyledTableCell align="right">Phone number</StyledTableCell>
            <StyledTableCell align="right">Age</StyledTableCell>
            <StyledTableCell align="right">Height</StyledTableCell>
            <StyledTableCell align="right">Weight</StyledTableCell>
            <StyledTableCell align="right">Shirt Size</StyledTableCell>
            <StyledTableCell align="right">Registration</StyledTableCell>
            <StyledTableCell align="right">Role</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user.name}>
              <StyledTableCell align="right">{user.first_name} {user.last_name}</StyledTableCell>
              <StyledTableCell align="right">{user.username}</StyledTableCell>
              <StyledTableCell align="right">{user.email}</StyledTableCell>
              <StyledTableCell align="right">{user.profile.phone_number}</StyledTableCell>
              <StyledTableCell align="right">{user.profile.age}</StyledTableCell>
              <StyledTableCell align="right">{user.profile.height}</StyledTableCell>
              <StyledTableCell align="right">{user.profile.weight}</StyledTableCell>
              <StyledTableCell align="right">{user.profile.shirt_size}</StyledTableCell>
              <StyledTableCell align="right">{user.profile.registration}</StyledTableCell>
              <StyledTableCell align="right">{user.profile.roles}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
