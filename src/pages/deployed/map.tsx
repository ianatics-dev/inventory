import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Grid, TextField, Typography } from '@mui/material';
import app from '../../http_settings';

const containerStyle = {
    width: '100%',
    height: '400px',
    cursor: "pointer",
};

const center = {
    lat: 7.131229,
    lng: 125.640110
}
const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;

function MapDeployment(props: any) {
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<any>();
    const [selectedIds, setSelectedIds] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [searchText, setSearchText] = useState('');
    const [deploymentName, setDeploymentName] = useState<any>();


    const mapRef = useRef<google.maps.Map | null>(null);
    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            console.log(`Latitude: ${lat}, Longitude: ${lng}`);
            const url_address = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&format=json`
            axios.get(url_address).then((res: any) => {
                setAddress(res.data.display_name)
            })
            const newMarker = { lat, lng };
            setMarker(newMarker);
            // setLabel('Starting Point');
        }
    }, []);

    const filteredData = rows.filter((item: any) =>
        item.full_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: GridColDef[] = [
        {
            field: 'fullNameWithRank',
            headerName: 'Rank / Name',
            width: 200,
            renderCell: (params) => (
                `${params.row.rank.rank_code} ${params.row.full_name}`
            )
        },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: 'unit',
            headerName: 'Unit',
            width: 200,
            valueGetter: (params: any) => (params.description),
        },
        {
            field: 'station',
            headerName: 'Station',
            width: 200,
            valueGetter: (params: any) => (params.description),
        },

    ];

    const handleSelectionModelChange = (newSelection: any) => {
        const persons = newSelection.map((id: any) => ({
            person_id: id,
            is_arrived: false
        }));
        setSelectedIds(persons);
    };

    useEffect(() => {
        const getPersons = () => {
            app.get("api/person_dropdown").then((res: any) => {
                setRows(res.data)
            })
        }
        getPersons();
    }, [])

    useEffect(() => {
        props.handleMapPicker({
            personel_ids: selectedIds,
            address: address,
            marker: marker,
            deployment_name: deploymentName
        })
    }, [selectedIds, address, marker])


    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                >

                    {marker && (
                        <Marker position={{ lat: marker.lat, lng: marker.lng }} />
                    )}

                </GoogleMap>
                <Grid sx={{ marginTop: "10px", display: "flex" }}>
                    <Grid sx={{ marginTop: "10px", display: "block" }}>
                        <Typography sx={{ ml: 2, flex: 1, marginBottom: "4px" }} component="div">
                            Deployment_name:
                        </Typography>
                        <Typography sx={{ ml: 2, flex: 1, marginTop: "20px" }} component="div">
                            Destination:
                        </Typography>
                    </Grid>
                    <Grid sx={{ marginTop: "10px", display: "block" }}>
                        <Typography sx={{ ml: 2, flex: 1, marginTop: "-5px", marginBottom: "10px" }} component="div">
                            <TextField
                                required
                                id="standard-basic"
                                variant="standard"
                                value={deploymentName}
                                onChange={(e) => setDeploymentName(e.target.value)}
                                sx={{ width: "40em" }}
                            />
                        </Typography>
                        <Typography sx={{ ml: 2, flex: 1 }} component="div">
                            <TextField id="standard-basic" variant="standard" value={address ? address : ""} sx={{ width: "40em" }} disabled/>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid sx={{ display: "flex", mt: 4 }}>
                    <Typography sx={{ ml: 2, mt: 1 }} component="div">
                        Personel:
                    </Typography>
                    <TextField
                        label="Search Personel"
                        variant="outlined"
                        size='small'
                        sx={{ ml: 4 }}
                        value={searchText}
                        onChange={(event: any) => { setSearchText(event.target.value); }}

                    />
                </Grid>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionModelChange}
                    sx={{
                        mt: 2,
                        height: 400
                    }}
                />

            </div>
        </LoadScript>
    )
}

export default MapDeployment