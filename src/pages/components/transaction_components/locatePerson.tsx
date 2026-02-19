import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 0,
    lng: 0,
};

export const LocatePerson = (props: any) => {
    const [location, setLocation] = useState({ lat: 7.100502, lng: 125.609751 });
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [clickMarker, setClickMarker] = useState(false);

    useEffect(() => {
        setCenter(props.location)
        setLocation(props.location)
    }, [])

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
            >
                <MarkerF position={location}
                    icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                // onClick={() => setClickMarker(true)}
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
            </GoogleMap>
        </LoadScript>
    );
};

