import React, { useEffect, useState } from 'react';
import { Button, MenuItem, Select, Grid, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SelectChangeEvent } from '@mui/material/Select';
import app from '../../http_settings';
import TrackMap from './track_map';
import { GoogleMap, LoadScript, MarkerF, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;


const TrackSelect: React.FC = () => {
  const [selects, setSelects] = useState<string[]>(['']);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [selectOptions, setSelectOptions] = useState<any>([]);
  const [paths, setPaths] = useState<any>([]);
  const [address, setAddress] = useState<any>();

  let socket: WebSocket;

  const connectWebSocket = () => {
    let access_token = localStorage.getItem("access_token")
    socket = new WebSocket(`ws://localhost:8000/ws/track_person/?token=${access_token}`);
    // socket = new WebSocket(`wss://gpsrehiyononse.online/ws/track_person/?token=${access_token}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      setPaths(data)
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
      // Retry connection after a delay
      setTimeout(connectWebSocket, 5000);
    };
    setWs(socket);
  }

  useEffect(() => {
    connectWebSocket();

    const getData = () => {
      app.get("/api/person_dropdown/").then((res: any) => {
        setSelectOptions(res.data)
      })
    }

    getData();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [])

  const addSelect = () => {
    setSelects([...selects, '']);
  };

  // useEffect(() => {
  //     let id = localStorage.getItem("id")
  //     app.get(`/api/deployed_units/by-person/?person_id=${id}`).then((res: any) => {
  //         if (res.data.length !== 0) {
  //             // setDestination(JSON.parse(res.data[0].coordinates))
  //             // setAddress(res.data[0].destination)
  //             // setId(res.data[0].id)
  //         } else {
  //             setAddress("Not Assigned")
  //         }
  //     })
  // }, [])

  const handleChange = (index: number) => (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    const newSelects = selects.map((select, i) => (i === index ? event.target.value as string : select));
    setSelects(newSelects);

    // Send the updated value to the WebSocket server
    if (ws) {
      ws.send(JSON.stringify({ value: newSelects }));
    }

  };

  const getAvailableOptions = (currentSelect: string) => {
    return selectOptions.filter((option: any) => !selects.includes(option.full_name) || option.full_name === currentSelect);
  };

  return (
    <>
      <Grid container spacing={2} direction="row">
        {selects.map((select, index) => (
          <Grid item key={index}>
            <Select
              value={select}
              onChange={handleChange(index)}
              displayEmpty
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {getAvailableOptions(select).map((option: any) => (
                <MenuItem key={option.id} value={option.full_name}>
                  {option.rank.rank_code} - {option.full_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        ))}
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addSelect}
          >
            Add Select
          </Button>
        </Grid>
      </Grid>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 540,
          marginTop: "10px"
        }}
      >

        <TrackMap data={paths} />


      </Paper>
    </>
  );
};

export default TrackSelect;
