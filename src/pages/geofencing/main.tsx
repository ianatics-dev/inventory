import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Button } from '@mui/material';
import DisplayGeoFence from './geofencing';
import AddGeoFence from './addGeoFence';
import { LoadScript } from '@react-google-maps/api';
// import app from '../../http_settings';
import EditGeofence from './editGeofence';


const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const libraries: any = ['drawing'];

function GeoFencing() {
  const [data, setData] = useState<any>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [value, setValue] = useState<string>("0");
  const [coordinates, setCoordinates] = useState<any>([]);
  const [center, setCenter] = useState<any>();

  // const handleChange = (event: SelectChangeEvent) => {
  //   setValue(event.target.value);
  //   if (event.target.value !== "0") {
  //     getGeoFencing(event.target.value)
  //   } else {
  //     app.get("/api/geofencing/").then((res: any) => {
  //       setCoordinates(res.data)
  //     })
  //   }
  // };

  // useEffect(() => {
  //   app.get("/api/geofencing/").then((res: any) => {
  //     setData(res.data)
  //     console.log(res.data)
  //     setCoordinates(res.data)
  //   })
  // }, [])

  // const getGeoFencing = (id: any) => {
  //   app.get(`/api/geofencing/${id}`).then((res) => {
  //     // setCoordinates(JSON.parse(res.data.coordinates))
  //     setCoordinates(res.data)
  //     setCenter(JSON.parse(res.data.center))
  //   })
  // }

  

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <div>
        <div>
          <FormControl sx={{ width: "400px", marginBottom: "10px", float: "left" }}>
            <InputLabel id="demo-simple-select-label">Place</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
              label="Place"
              // onChange={handleChange}
            >
              <MenuItem value="0">All</MenuItem>
              {
                data.map((items: any) => (
                  <MenuItem value={items.id} key={items.id}>{items.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
          <Button sx={{ float: "left", marginTop: "10px", marginLeft: "10px" }} onClick={() => setModal(true)}>
            Add Geofence
          </Button>
          <Button sx={{ float: "left", marginTop: "10px", marginLeft: "10px" }} onClick={() => setEditModal(true)}>
            Edit Geofence
          </Button>
          <AddGeoFence open={modal} onClose={() => setModal(false)} />
          <EditGeofence open={editModal} onClose={() => setEditModal(false)}/>
        </div>
        <div>
          <DisplayGeoFence coordinates={coordinates} polycenter={center} />
        </div>
      </div>
    </LoadScript>
  )
}

export default GeoFencing