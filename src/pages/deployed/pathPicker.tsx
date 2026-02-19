import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import app from '../../http_settings';
import axios from 'axios';
import moment from 'moment';
import { Checkbox, Grid, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import app from '../../http_settings';

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const REFRESH_INTERVAL = 3000;

const containerStyle = {
    width: '100%',
    height: '400px',
    cursor: "pointer",
};

const center = {
    lat: 7.131229,
    lng: 125.640110
}

// const columns: GridColDef[] = []

function MapPicker(props: any) {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [path, setPath] = useState<any>([]);
    const [route, setRoute] = useState<any>([]);
    const [address, setAddress] = useState<any>([]);
    const [distance, setDistance] = useState<any>();
    const [duration, setDuration] = useState<any>();
    const [label, setLabel] = useState('Starting Point');
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedIds, setSelectedIds] = useState<any>([]);

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
                setAddress((current: any) => [...current, res.data.display_name])
            })
            setMarkers((current) => [
                ...current,
                {
                    lat,
                    lng
                },
            ]);
            setLabel('Starting Point');
        }
    }, []);

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

    const displayRoute = () => {
        if (markers.length === 2) {
            let startingPoint = `${markers[0].lng},${markers[0].lat}`
            let destination = `${markers[1].lng},${markers[1].lat}`
            const url_route = `https://router.project-osrm.org/route/v1/driving/${startingPoint};${destination}?overview=full&geometries=geojson`
            axios.get(url_route).then((res: any) => {
                console.log(res.data, "routes")
                const coordinates = res.data.routes[0].geometry.coordinates
                const formattedCoordinates = coordinates.map(([lng, lat]: any) => ({ lat, lng }));
                setRoute(formattedCoordinates)
                let travelDuration = Math.floor(res.data.routes[0].duration / 60)
                setDuration(travelDuration)
                let km = res.data.routes[0].distance / 1000;
                setDistance(km.toFixed(1))
                props.handleMapPicker({
                    addresses: address,
                    distance: km.toFixed(1),
                    duration: travelDuration
                })
            });
        }
    };

    const handleSelectionModelChange = (newSelection: any) => {
        setSelectedIds(newSelection);
    };

    const getSelectedRowsData = () => {
        const selectedRows = rows.filter((row: any) => selectedIds.includes(row.id));
        console.log(selectedRows);
    };

    const handleSearchChange = (event: any) => {
        setSearchText(event.target.value);
    };

    const filteredData = rows.filter((item: any) =>
        item.full_name.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        const getPersons = () => {
            app.get("api/person_dropdown").then((res: any) => {
                setRows(res.data)
            })
        }
        getPersons();
    }, [])

    useEffect(() => {
        if (markers.length && address.length === 2) {
            displayRoute();
        }

    }, [markers, address])
    

    // useEffect(() => {
    //     getSelectedRowsData();
    // }, [selectedIds])

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                    options={{
                        draggingCursor: "crosshair"
                    }}
                >
                    {markers.map((marker, index) => (
                        <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
                    ))}
                    <Polyline
                        path={route}
                        options={{ strokeColor: "#3d37f0", strokeOpacity: 0.7, strokeWeight: 10 }}
                    />
                </GoogleMap>
                <Grid sx={{ marginTop: "10px", display: "flex" }}>
                    <Grid sx={{ marginTop: "10px", display: "block" }}>
                        <Typography sx={{ ml: 2, flex: 1, marginBottom: "4px" }} component="div">
                            Destination:
                        </Typography>
                    </Grid>
                    <Grid sx={{ marginTop: "10px", display: "block" }}>
                        <Typography sx={{ ml: 2, flex: 1 }} component="div">
                            <TextField id="standard-basic" variant="standard" value={address[1] ? address[1] : "End"} sx={{ width: "40em" }} />
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
                        onChange={handleSearchChange}

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

export default MapPicker;