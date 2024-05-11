import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses, TableCell, MenuItem, Box, Typography, TableContainer, TableHead, TableRow, Paper, FormControl, Select, InputLabel } from '@mui/material';
import axios from 'axios';
import { authStore } from '../../stores/auth_store/Store';

const API_URL = import.meta.env.VITE_API_URL;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#845EC2',
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

export default function UsersTable() {
  const { token } = authStore((state) => state);
  const [users, setUsers] = useState([]);
  const [shirtSizeFilter, setShirtSizeFilter] = useState("all");
  const [registrationFilter, setRegistrationFilter] = useState("all");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/authentication/admin/get-users/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to get users:", error);
      } finally {
        setLoading(false); // Set loading state to false when request completes
      }
    };

    fetchUsers();
  }, [token]);

  // Function to filter users based on shirt size and registration
  const filteredUsers = users.filter(user => {
    if (shirtSizeFilter !== "all" && user.profile.shirt_size !== shirtSizeFilter) {
      return false;
    }
    if (registrationFilter !== "all" && user.profile.registration !== (registrationFilter === "true")) {
      return false;
    }
    return true;
  });

  // Function to count users based on filters
  const currentDisplayedCount = () => {
    return filteredUsers.length;
  };

  // Function to count total users
  const totalUsersCount = () => {
    if (users) return users.length
    return users
  }
  
  return (
    <>
      <div style={{ display: 'flex' }}>
        {/* Filter by shirt size */}
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Shirt Size</InputLabel>
            <Select
              id="shirtSizeFilter"
              value={shirtSizeFilter}
              onChange={e => setShirtSizeFilter(e.target.value)}
              label="Shirt size"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="SMALL">Small</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="LARGE">Large</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="2XL">2XL</MenuItem>
              <MenuItem value="3XL">3XL</MenuItem>
              <MenuItem value="4XL">4XL</MenuItem>
              {/* Add more sizes as needed */}
            </Select>
          </FormControl>
        </Box>
        {/* Filter by registration status */}
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Registration</InputLabel>
            <Select
              value={registrationFilter}
              onChange={e => setRegistrationFilter(e.target.value)}
              label="Registration"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      {loading ? ( // Conditionally render loading message
        <Typography variant="h5" sx={{ textAlign: 'center', paddingTop: '50px' }}>Loading table...</Typography>
      ) : filteredUsers.length > 0 ? (
        <>
          <Typography variant="h6" display="block" gutterBottom>
            Total users: {totalUsersCount()}
          </Typography>
          <Typography variant="h6" display="block" gutterBottom>
            Users displayed: {currentDisplayedCount()}
          </Typography>
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
                {filteredUsers.map((user) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell align="right">{user?.first_name} {user?.last_name}</StyledTableCell>
                    <StyledTableCell align="right">{user?.username}</StyledTableCell>
                    <StyledTableCell align="right">{user?.email}</StyledTableCell>
                    <StyledTableCell align="right">{user?.profile.phone_number}</StyledTableCell>
                    <StyledTableCell align="right">{user?.profile.age}</StyledTableCell>
                    <StyledTableCell align="right">{user?.profile.formatted_height}</StyledTableCell>
                    <StyledTableCell align="right">{user?.profile.weight}</StyledTableCell>
                    <StyledTableCell align="right">{user?.profile.shirt_size}</StyledTableCell>
                    <StyledTableCell align="right">{user?.profile.registration ? "True" : "False"}</StyledTableCell>
                    <StyledTableCell align="right">{user?.profile.roles}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <Typography variant="h5" sx={{ textAlign: 'center', paddingTop: '50px' }}>No users found with the applied filters</Typography>
        </>
      )}
    </>
  );
}
