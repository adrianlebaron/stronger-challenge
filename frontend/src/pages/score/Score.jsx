import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography } from '@mui/material';
import { getTotalWorkoutsByUser } from '../../services/UserApiRequest';

export default function Score() {
  const [totalWorkouts, setTotalWorkouts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalWorkouts = async () => {
      try {
        const data = await getTotalWorkoutsByUser();
        setTotalWorkouts(data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data.');
        console.error("Failed to fetch total workouts:", error);
      }
    };

    fetchTotalWorkouts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className='container'> <br/>
      {totalWorkouts !== null ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Athlete</TableCell>
                <TableCell>Total Workouts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(totalWorkouts).map(userId => (
                <TableRow key={userId}>
                  <TableCell>{userId}</TableCell>
                  <TableCell>{totalWorkouts[userId]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h5" sx={{textAlign: 'center', paddingTop: '50px'}}>Loading table...</Typography>
      )}
    </Container>
  );
}
	