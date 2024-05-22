import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box, Typography, Container } from '@mui/material';
import PostWorkoutModal from '../../components/PostWorkoutModal';
import Challenge from '../../components/Challenge';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const [value, setValue] = useState(() => {
    // Get the stored tab value from localStorage or default to 0
    return parseInt(localStorage.getItem('selectedTab') || '0');
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Store the selected tab index in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedTab', value.toString());
  }, [value]);

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="basic tabs example" 
            centered textColor="secondary" 
            indicatorColor="secondary"
            variant="scrollable"
            >
            <Tab label="Workouts" {...a11yProps(0)} />
            <Tab label="Challenges" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <PostWorkoutModal />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Challenge />
        </CustomTabPanel>
      </Box>
    </Container>
  );
}
