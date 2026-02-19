import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript, Polygon, Polyline } from '@react-google-maps/api';
import { styled } from '@mui/material/styles';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Button, IconButton, Snackbar } from '@mui/material';
import app from '../http_settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFiles from './upload/upload';
import CloseIcon from '@mui/icons-material/Close';
import { access } from 'fs';

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const REFRESH_INTERVAL = 3000;
const URL: string = process.env.REACT_APP_WS_URL!;

const containerStyle = {
    width: '100%',
    height: '400px',
};

interface Location {
    lat: number;
    lng: number;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const GPSMap: React.FC = () => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [clickMarker, setClickMarker] = useState(false);
    const [clickMarker2, setClickMarker2] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [coordinates, setCoordinates] = useState<any>([]);
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [notificationShown, setNotificationShown] = useState<boolean>(false);
    const [path, setPath] = useState<any>([]);
    const [destination, setDestination] = useState({ lat: 0, lng: 0 });
    const [route, setRoute] = useState<any>([]);
    const [address, setAddress] = useState<any>();
    const [id, setId] = useState<any>();

    let socket: WebSocket;

    const isLocationInsidePolygon = (userLocation: Location): boolean => {
        if (!window.google?.maps) return false;
        if (coordinates.length !== 0) {
            const googlePolygon = new window.google.maps.Polygon({
                paths: coordinates,
            });
            return google.maps.geometry.poly.containsLocation(userLocation, googlePolygon);
        }
        return false;
    };

    const displayRoute = (marker1: any, marker2: any) => {
        const url_route = `https://router.project-osrm.org/route/v1/driving/${marker1};${marker2}?overview=full&geometries=geojson&continue_straight=true`
        axios.get(url_route).then((res: any) => {
            const coordinates = res.data.routes[0].geometry.coordinates
            const formattedCoordinates = coordinates.map(([lng, lat]: any) => ({ lat, lng }));
            setRoute(formattedCoordinates)
        });
    }

    const connectWebSocket = () => {
        let access_token = localStorage.getItem("access_token")
        const socketUrl = `ws://127.0.0.1:8000/ws/some_path/?token=${access_token}`;
        // const socketUrl = `wss://gpsrehiyononse.online/ws/some_path/?token=${access_token}`;
        // const socketUrl = URL;

        socket = new WebSocket(socketUrl);

        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        socket.onopen = () => {
            console.log('WebSocket connected');
            navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    const { latitude, longitude } = position.coords;
                    const newPath = { lat: latitude, lng: longitude };
                    const email = localStorage.getItem("email")
                    const data = { latitude, longitude, email };
                    socket.send(JSON.stringify(data)); // Send GPS data to the server
                },
                (error) => {
                    if (error.code == 1) {
                        console.log("Error: Access is denied!");
                    } else if (error.code == 2) {
                        console.log("Error: Position is unavailable!");
                    }
                },
                options
            );
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
        };

        socket.onclose = (event) => {
            console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
            // Retry connection after a delay
            setTimeout(connectWebSocket, 5000);
        };
    }
    
    useEffect(() => {
        let wakeLock: any;
    
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                  wakeLock = await navigator.wakeLock?.request('screen');
                  console.log('Wake Lock granted');
                } catch (err: any) {
                  console.error(`${err.name}, ${err.message}`);
                }
              } else {
                console.error('Wake Lock API is not supported in this browser.');
              }
        };
    
        requestWakeLock();
    
        return () => {
          if (wakeLock) {
            wakeLock.release().then(() => {
              console.log('Wake Lock released');
            });
          }
        };
      }, []);

    useEffect(() => {
        connectWebSocket()
        // let unit = localStorage.getItem("unit")
        // app.get(`/api/get_geofencing/?unit=${unit}`).then((res: any) => {
        //     setCoordinates(res.data.coordinates)
        //     setOpenToast(false)
        // })
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    useEffect(() => {
        let id = localStorage.getItem("id")
        console.log(id, "user_id")
        app.get(`/api/deployed_units/by-person/?person_id=${id}`).then((res: any) => {
            if (res.data.length !== 0) {
                setDestination(JSON.parse(res.data[0].coordinates))
                setAddress(res.data[0].destination)
                setId(res.data[0].id)
            } else {
                setAddress("Not Assigned")
            }
        })
    }, [])

    useEffect(() => {
        if (location.lat !== 0 && location.lng !== 0 && destination.lng !== 0 && destination.lat) {
            let markerOne = `${location.lng},${location.lat}`;
            let markerTwo = `${destination.lng},${destination.lat}`;
            displayRoute(markerOne, markerTwo);
        }
        console.log(location)
    }, [location])

    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const userLocation: Location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setLocation(userLocation);

                if (!isLocationInsidePolygon(userLocation)) {
                    setOpenToast(true);
                }
            },
            (error) => {
                if (error.code === 1) {
                    console.log("Error: Access is denied!");
                } else if (error.code === 2) {
                    console.log("Error: Position is unavailable!");
                }
            },
            options
        );

        const notificationTimer = setInterval(() => {
            setNotificationShown(false);
        }, REFRESH_INTERVAL);


        return () => {
            navigator.geolocation.clearWatch(watchId);
            clearInterval(notificationTimer); // Clear the notification timer
        };
    }, [coordinates, notificationShown]);

    const handleLogOut = () => {
        // 
        if (socket) {
            socket.close()
        }
        localStorage.clear()
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    const handlePathLine = () => {
        // console.log(id)
        let userId = localStorage.getItem("id");
        app.patch(`/api/deployed_units/${id}/update-arrival-status/`, {
            "person_id": userId,
            "is_arrived": true
        }).then((res) => {
            console.log(res)
        })
    }

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    // console.log(destination)

    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <LoadScript googleMapsApiKey={API_KEY}>
                <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={13}>
                    <Polygon
                        options={{
                            fillColor: '#2196f3',
                            strokeColor: '#2196f3',
                            fillOpacity: 0.1,
                            strokeWeight: 2,
                        }}
                        path={coordinates}
                    />
                    <MarkerF
                        position={location}
                        icon="http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
                        onClick={() => setClickMarker(true)}
                    >
                        {clickMarker && (
                            <InfoWindowF onCloseClick={() => setClickMarker(false)} position={location}>
                                <div>
                                    <p>Your current location</p>
                                    {location.lat}
                                    <br />
                                    {location.lng}
                                </div>
                            </InfoWindowF>
                        )}
                    </MarkerF>
                    <MarkerF
                        position={destination}
                        icon="http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
                        onClick={() => setClickMarker2(true)}
                    >
                        {/* {clickMarker2 && (
                            <InfoWindowF onCloseClick={() => setClickMarker2(false)} position={destination}>
                            <div>
                                <p>Your destination</p>
                                <span>{address}</span>
                            </div>
                            </InfoWindowF>
                        )} */}
                    </MarkerF>
                    <Polyline
                        path={route}
                        options={{ strokeColor: '#3d37f0', strokeOpacity: 0.7, strokeWeight: 10 }}
                    />
                </GoogleMap>
            </LoadScript>
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', flex: '1 0 auto' }}>
                <p>Destination: <strong>{address}</strong></p>
                <Button href="/" onClick={handleLogOut} variant="outlined" style={{ marginRight: '10px' }}>
                    Logout
                </Button>
                <Button onClick={handlePathLine} variant="outlined">
                    Arrived
                </Button>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openToast}
                autoHideDuration={6000}
                onClose={handleClose}
                message="You are outside the polygon!"
                action={
                    <Button color="secondary" size="small" onClick={handleClose}>
                        CLOSE
                    </Button>
                }
            />
        </div>

    );
};

export default GPSMap;
