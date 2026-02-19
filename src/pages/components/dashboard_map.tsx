import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { MultiPoint, LineString, Polygon } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import axios from 'axios';
import { useGeographic } from 'ol/proj';
import app from '../../http_settings';

const MapTab: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<any>();
  const [points, setPoints] = useState<[number, number][]>([]);
  const center: [number, number] = [125.636086, 7.131476];
  const zoomLevel = 12;
  useGeographic();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await app.get('/api/transaction/');
        const locations = response.data.results.map((item: any) => [item.lng, item.lat]);
        setPoints(locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (points.length === 0) return;

    const multiPoint = new MultiPoint(points);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [new Feature({ geometry: multiPoint })],
      }),
      style: new Style({
        image: new CircleStyle({
          radius: 9,
          fill: new Fill({
            color: 'red',
          }),
        }),
      }),
    });

    const map = new Map({
      target: mapContainerRef.current!,
      view: new View({
        center: center,
        zoom: zoomLevel,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
    });

    const popup = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-center',
      stopEvent: false,
    });
    map.addOverlay(popup);

    function formatCoordinate(coordinate: [number, number]) {
      const lat = coordinate[1];
      const lon = coordinate[0];

      return `
        <table>
          <tbody>
            <tr><th>Latitude</th><td>${lat}</td></tr>
            <tr><th>Longitude</th><td>${lon}</td></tr>
          </tbody>
        </table>`;
    }

    map.on('click', (event) => {
      if (popoverRef.current) {
        popoverRef.current.dispose();
        popoverRef.current = undefined;
      }
      const feature = map.getFeaturesAtPixel(event.pixel)?.[0];
      if (!feature) {
        return;
      }
      const geometry = feature.getGeometry();
      let coordinate: [number, number] | undefined;

      if (geometry instanceof MultiPoint) {
        const coordinates = geometry.getCoordinates() as [number, number][];
        if (coordinates.length > 0) {
          coordinate = coordinates[0];
        }
      } else if (geometry instanceof LineString || geometry instanceof Polygon) {
        const coordinates = geometry.getCoordinates() as [number, number][] | [number, number][];
        if (coordinates.length > 0) {
          coordinate = coordinates[0];
        }
      }

      if (!coordinate) {
        return;
      }

      const transformedCoordinate = map.getCoordinateFromPixel(event.pixel);
      if (!transformedCoordinate) {
        return;
      }

      popup.setPosition(transformedCoordinate);

      const content = formatCoordinate(coordinate);
      popupRef.current!.innerHTML = content;

      popoverRef.current = {
        show: () => {
          popupRef.current!.style.display = 'block';
        },
        dispose: () => {
          popupRef.current!.style.display = 'none';
        },
      };
      popoverRef.current.show();
    });

    map.on('pointermove', (event) => {
      const type = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
      map.getViewport().style.cursor = type;
    });

    return () => {
      map.setTarget('');
    };
  }, [points]);

  return (
    <div>
      <style>{`
        .ol-attribution {
          display: none !important;
        }
      `}</style>
      <div ref={mapContainerRef} style={{ width: '100%', height: 400 }} />
      <div ref={popupRef} style={{ display: 'none', position: 'absolute', backgroundColor: '#fff', padding: '10px' }}></div>
    </div>
  );
};

export default MapTab;
