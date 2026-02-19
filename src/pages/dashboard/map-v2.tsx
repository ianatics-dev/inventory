import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const REFRESH_INTERVAL = 60000; // 1 minute

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 0,
    lng: 0,
};

const GPSMap = (props: any) => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [center, setCenter] = useState({ lat: 0, lng: 0 })

    const [clickMarker, setClickMarker] = useState<any>({});
    const [selectedMarker, setSelectedMarker] = useState<any>();

    useEffect(() => {
        setCenter({
            lat: 7.131229,
            lng: 125.640110
        })
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
                    {props.data.map((items: any, index: any) => {
                        return (
                            <MarkerF position={{ lat: parseFloat(items.lat), lng: parseFloat(items.lng) }}
                                icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                                onClick={() => handleMarkerClick(index)}
                                key={index}
                            >
                                {clickMarker[index] && selectedMarker === index && (
                                    <InfoWindowF onCloseClick={() => handleInfoWindowClose(index)} position={location}>
                                        <div>
                                            <p>Name: {items.person.full_name}</p>
                                            <p>Lat: {items.lat}</p>
                                            <p>Lng: {items.lng}</p>
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

export default GPSMap;
