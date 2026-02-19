import { Grid, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import Testing from './components/dashboard_map'
import MapComponent from './dashboard/map';
import MapTab from './dashboard/map'
import TransactionTable from './dashboard/transaction'
import Transaction from './components/Transaction';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import GPSMap from './dashboard/map-v2';
import app from '../http_settings';
import GeoFencing from './geofencing/geofencing';
import TrackSelect from './track_person/track_select';
import TrackMap from './track_person/track_map';

const Dashboard = () => {
  const [value, setValue] = React.useState('1');
  const [searchInput, setSearchInput] = React.useState();
  // const [points, setPoints] = useState<any>([]);
  // const [location, setLocation] = useState([{ lat: 0, lng: 0 }]);
  const [data, setData] = useState<any>([]);
  const [status, setStatus] = useState<any>();
  const [token, setToken] = useState<any>("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const fetchData = async (search: any) => {
    try {
      const response = await app.get(`/api/dashboard/?station=${search}`);
      setData(response.data)
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setToken(access_token);
    const getData = async () => {
      try {
        const response = await app.get('/api/dashboard/');
        setData(response.data)
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    getData();
  }, [])



  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      fetchData(searchInput)
    }
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Dashboard" value="1" />
                <Tab label="Transaction" value="2" />
                <Tab label="Map" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TextField
                label="Station"
                value={searchInput}
                onChange={(e: any) => { setSearchInput(e.target.value) }}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
                style={{ marginLeft: '54em', marginBottom: '10px', width: "16.5em" }}
                onKeyPress={handleKeyPress}
              />
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 440,
                  }}
                >
                  <GPSMap data={data} />
                  {/* <MapComponent points={points}/> */}
                </Paper>
              </Grid>
              <Grid item xs={12} lg={12} sx={{ marginTop: "12px" }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <TransactionTable />
                </Paper>
              </Grid>
            </TabPanel>
            <TabPanel value="2"><Transaction /></TabPanel>
            <TabPanel value="3">
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 540,
                }}
              >
                <MapTab data={data} />

              </Paper>
            </TabPanel>
            
          </TabContext>
        </Box>
      </Grid>
    </div>
  )
}

export default Dashboard