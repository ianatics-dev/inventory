import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript, Polyline } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import app from '../../http_settings';

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


const TrackMap = (props: any) => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [center, setCenter] = useState({ lat: 0, lng: 0 })

    const [clickMarker, setClickMarker] = useState<any>({});
    const [selectedMarker, setSelectedMarker] = useState<any>();
    const [paths, setPaths] = useState<any>([]);

    // const [address, setAddress] = useState<any>();

    useEffect(() => {
        setPaths(props.data)
        console.log(props.data)
        
    }, [props.data])

    useEffect(() => {
        setCenter({
            lat: 7.131229,
            lng: 125.640110
        });
    }, [])


    const handleInfoWindowClose = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: false });
    };

    const handleMarkerClick = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: true });
        setSelectedMarker(index);
    };

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={9}
                >
                    {paths ? paths.map((items: any, index: any) => {

                        return (
                            <>
                                <Polyline path={items.path} options={{ strokeColor: '#FF0000', strokeWeight: 2 }} 
                                key={index + 1}
                                />

                                <MarkerF position={{ lat: parseFloat(items.lat), lng: parseFloat(items.lng) }}
                                    icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                                    onClick={() => handleMarkerClick(index)}
                                    key={index}
                                >
                                    {clickMarker[index] && selectedMarker === index && (
                                        <InfoWindowF onCloseClick={() => handleInfoWindowClose(index)} position={location}>
                                            <div>
                                                <p>{items.name}</p>
                                                <p>Lat: {items.lat}</p>
                                                <p>Lng: {items.lng}</p>
                                                <p>Destination: {items.destination}</p>
                                                {/* <p>Date time: {moment(row.datetime).format("MMMM Do YYYY, h:mm:ss a")}</p> */}
                                            </div>
                                        </InfoWindowF>
                                    )}

                                </MarkerF>
                            </>

                        )
                    }) : null}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default TrackMap;
