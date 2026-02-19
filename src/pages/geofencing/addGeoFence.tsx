import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, DialogContent, DialogContentText, FormControl, InputLabel, MenuItem, Modal, Paper, Select, Tab, TextField } from '@mui/material';
// import { LocatePerson } from './locatePerson';
import Dialog from '@mui/material/Dialog';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { DrawingManager, GoogleMap, LoadScript, MarkerF, Polygon } from '@react-google-maps/api';
import app from '../../http_settings';




const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 7.100502,
    lng: 125.609751,
};

function AddGeoFence(props: any) {
    const [state, setState] = useState<any>({
        drawingMode: "polygon"
    });
    const [isDrawing, setIsDrawing] = useState<boolean>(true);

    const [path, setPath] = useState<any>("");
    const [name, setName] = useState<string>("");
    const [coordinates, setCoordinates] = useState<string>("");
    const [polyCenter, setPolyCenter] = useState<any>();
    const [subUnitList, setSubUnitList] = useState<any>([]);
    const [unit, setUnit] = useState<any>();

    const options: any = {
        drawingControl: true,
        drawingControlOptions: {
            drawingMode: ['Polygon']
        },
        polygonOptions: {
            fillColor: "#2196f3",
            stroke: "#2196f3",
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            draggable: false,
            zindex: 1,
        }
    }

    const onPolygonComplete = useCallback(
        (poly: google.maps.Polygon) => {
            const polyArray = poly.getPath().getArray();

            let paths: { lat: number; lng: number }[] = [];
            let Latsum = 0;
            let Lngsum = 0;

            polyArray.forEach((path) => {
                // console.log(path)
                paths.push({ lat: path.lat(), lng: path.lng() });
                Latsum += path.lat()
                Lngsum += path.lng()
            });

            const latCenter = Latsum / polyArray.length;
            const lngCenter = Lngsum / polyArray.length;

            let getCenter = JSON.stringify({ lat: latCenter, lng: lngCenter })

            setPolyCenter(getCenter);

            setCoordinates(JSON.stringify(paths))
            setPath(paths)
            poly.setMap(null)
            setIsDrawing(false)
        },
        []
    );

    const handelSave = () => {
        // console.log(unit)
        app.post('/api/geofencing/', {
            name: unit,
            coordinates: coordinates,
            center: polyCenter
        }).then((res: any) => {
            props.onClose()
        })
    }

    useEffect(() => {
        app.get("/api/subunit_choices/").then((res: any) => {
            setSubUnitList(res.data)
        })
    }, [])


    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"lg"}>
            <DialogContent>
                <FormControl sx={{ marginBottom: "10px", width: "20em" }}>
                    <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={unit}
                        label="Unit"
                        onChange={(e) => setUnit(e.target.value)}
                    >
                        {subUnitList.map((items: any) => (
                            <MenuItem value={items.sub_unit_description} key={items.id}>{items.sub_unit_description}</MenuItem>
                        )
                        )}
                    </Select>
                </FormControl>
                <Button variant="text" sx={{ marginTop: "13px", marginLeft: "10px" }} onClick={handelSave}>add</Button>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 540,
                        width: 1150
                    }}
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={7.8}
                    >
                        {/* {
                            isDrawing ?
                                (
                                    <DrawingManager
                                        drawingMode={state.drawingMode}
                                        options={options}
                                        onPolygonComplete={onPolygonComplete}
                                    />
                                ) :
                                (
                                    <Polygon
                                        options={{
                                            fillColor: "#2196f3",
                                            strokeColor: "#2196f3",
                                            fillOpacity: 0.5,
                                            strokeWeight: 2,
                                        }}
                                        editable
                                        path={path}
                                    // onLoad={onLoad}
                                    // onUnmount={onUnmount}
                                    // onEdit={onEdit}
                                    // onMouseUp={onEdit}
                                    />
                                )
                        } */}
                        <DrawingManager
                            drawingMode={state.drawingMode}
                            options={options}
                            onPolygonComplete={onPolygonComplete}
                        />
                        <Polygon
                            options={{
                                fillColor: "#2196f3",
                                strokeColor: "#2196f3",
                                fillOpacity: 0.5,
                                strokeWeight: 2,
                            }}
                            editable
                            path={path}
                        />
                    </GoogleMap>
                </Paper>
            </DialogContent>
        </Dialog>
    )
}

export default AddGeoFence;