import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import UsersTable from '../../components/Admin/UsersTable';
import WorkoutsTable from '../../components/Admin/WorkoutsTable';
import ChallengesTable from '../../components/Admin/ChallengesTable';
import ChallengeSubmissions from '../../components/Admin/ChallengeSubmissions';

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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered textColor="secondary" indicatorColor="secondary">
          <Tab label="Users table" {...a11yProps(0)} />
          <Tab label="Workouts table" {...a11yProps(1)} />
          <Tab label="Challenges" {...a11yProps(2)} />
          <Tab label="Challenge submissions" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UsersTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <WorkoutsTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ChallengesTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ChallengeSubmissions/>
      </CustomTabPanel>
    </Box>
  );
}