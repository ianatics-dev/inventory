import { Dialog, DialogContent, Paper } from '@mui/material'
import { GoogleMap } from '@react-google-maps/api'
import React from 'react'

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 7.100502,
    lng: 125.609751,
};

function EditGeofence(props : any) {
    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"lg"}>
            <DialogContent>
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
                        {/* <DrawingManager
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
                        // onLoad={onLoad}
                        // onUnmount={onUnmount}
                        // onEdit={onEdit}
                        // onMouseUp={onEdit}
                        /> */}
                    </GoogleMap>
                </Paper>
            </DialogContent>
        </Dialog>
    )
}

export default EditGeofence;