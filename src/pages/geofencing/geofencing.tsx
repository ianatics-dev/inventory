import React, { useState, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, Marker, LoadScript, DrawingManager, Polygon } from '@react-google-maps/api';



const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 7.131229,
    lng: 125.640110
};

function DisplayGeoFence({ coordinates, polycenter }: any) {


    const [path, setPath] = useState<any>([]);
    const [center, setCenter] = useState<any>();
    const [zoom, setZoom] = useState<any>();
    // const [displayAll, setDisplayAll] = useState<any>([]);

    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const listenerRef = useRef<google.maps.MapsEventListener[]>([])

    const options: any = {
        drawingControl: true,
        drawingControlOptions: {
            drawingMode: ['Polygon']
        },
        polygonOptions: {
            fillColor: "#2196f3",
            stroke: "#2196f3",
            fillOpacity: 0.1,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            draggable: true,
            zindex: 1,
        }
    }

    useEffect(() => {
        if (coordinates.length === undefined) {
            // setPath(JSON.parse(coordinates.coordinates))
            setPath(coordinates.coordinates)
            setCenter(polycenter)
            setZoom(9)
        } else {
            let getPath: any = []
            coordinates.map((items: any) => {
                getPath.push(JSON.stringify(items.coordinates))
            })
            setZoom(7.8)
            setCenter(defaultCenter)
            setPath(getPath)
        }
    }, [coordinates, center])


    const onPolygonComplete = useCallback(
        (poly: google.maps.Polygon) => {
            const polyArray = poly.getPath().getArray();
            let paths: { lat: number; lng: number }[] = [];
            polyArray.forEach((path) => {
                paths.push({ lat: path.lat(), lng: path.lng() });
            });
            console.log(paths)
            setPath(paths)
            // setIsDrawing(false)
            poly.setMap(null)
        },
        []
    );

    const onEdit = useCallback(
        () => {
            if (polygonRef.current) {
                const nextPath = polygonRef.current.getPath().getArray().map(latlng => {
                    return { lat: latlng.lat(), lng: latlng.lng() }
                });
                setPath(nextPath)
                console.log(nextPath)
            }
        }, [setPath]
    )

    const onLoad = useCallback(
        (polygon: google.maps.Polygon) => {
            polygonRef.current = polygon;
            const paths = polygon.getPath();
            listenerRef.current.push(
                paths.addListener("set_at", onEdit),
                paths.addListener("insert_at", onEdit),
                paths.addListener("remove_at", onEdit),
            )
        }, [onEdit]
    )

    // const onUnmount = useCallback(
    //     () => {
    //         listenerRef.current.forEach(lis => lis.remove())
    //         polygonRef.current = null;
    //     }, []
    // )


    return (
        <div style={{ height: '90vh', width: '100%', marginBottom: '100px' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center === undefined ? defaultCenter : center}
                zoom={zoom === undefined ? 7 : zoom}
            >
                {
                    typeof path[0] !== "object" ?
                        path.map((items: any, index: any) => {
                            console.log(items)
                            return (
                                <Polygon
                                    key={index.length}
                                    options={{
                                        fillColor: "#2196f3",
                                        strokeColor: "#2196f3",
                                        fillOpacity: 0.1,
                                        strokeWeight: 2,
                                    }}
                                    path={JSON.parse(items)}

                                />
                            )
                        })
                        : (
                            <Polygon
                                options={{
                                    fillColor: "#2196f3",
                                    strokeColor: "#2196f3",
                                    fillOpacity: 0.1,
                                    strokeWeight: 2,
                                }}
                                path={path}
                            />
                        )
                }
            </GoogleMap>

        </div>
    )
}

export default DisplayGeoFence;