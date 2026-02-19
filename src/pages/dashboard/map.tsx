import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript, Polyline } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import app from '../../http_settings';

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const REFRESH_INTERVAL = 1000; // 1 minute

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 0,
    lng: 0,
};

const Map = (props: any) => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [center, setCenter] = useState({ lat: 0, lng: 0 })

    const [clickMarker, setClickMarker] = useState<any>({});
    const [selectedMarker, setSelectedMarker] = useState<any>();

    const [data, setData] = useState<any>([]);
    const [token, setToken] = useState<any>('');
    const [path, setPath] = useState<any>([]);

    const [ws, setWs] = useState<any>();

    let socket: WebSocket;

    const connectWebSocket = () => {
        let access_token = localStorage.getItem("access_token")
        const socketUrl = `ws://127.0.0.1:8000/ws/dashboard/?token=${access_token}`;
        // const socketUrl = `wss://gpsrehiyononse.online/ws/dashboard/?token=${access_token}`;

        socket = new WebSocket(socketUrl);

        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setData(data)
            console.log(data)
        };

        socket.onclose = (event) => {
            console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
            // Retry connection after a delay
            setTimeout(connectWebSocket, 5000);
        };

    }

    useEffect(() => {
        connectWebSocket();
        setCenter({
            lat: 7.131229,
            lng: 125.640110
        })

        return () => {
            // clearInterval(intervalId);
            if (socket) {
                socket.close();
            }
        };

    }, [])

    const handleMarkerClick = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: true });
        setSelectedMarker(index);
    };

    const handleInfoWindowClose = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: false });
    };

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={7.8}
                >
                    {data.map((items: any, index: any) => {
                        return (
                            <MarkerF position={{ lat: parseFloat(items.lat), lng: parseFloat(items.lng) }}
                                icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                                onClick={() => handleMarkerClick(index)}
                                key={index}
                            >
                                
                                {clickMarker[index] && selectedMarker === index && (
                                    <InfoWindowF onCloseClick={() => handleInfoWindowClose(index)} position={location}>
                                        <div>
                                            <p>{items.person.rank.rank_code} {items.person.full_name}</p>
                                            <p>Lat: {items.lat}</p>
                                            <p>Lng: {items.lng}</p>
                                            {/* <p>Date time: {moment(row.datetime).format("MMMM Do YYYY, h:mm:ss a")}</p> */}
                                        </div>
                                    </InfoWindowF>
                                )}
                            </MarkerF>
                        )
                    })}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default Map;
