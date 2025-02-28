import React, { useState, useEffect, useCallback } from 'react';
import classes from './map.module.css';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { toast } from 'react-toastify';
import * as L from 'leaflet';

export default function Map({ readonly, location, onChange }) {
  return (
    <div className={classes.container}>
      <MapContainer
        className={classes.map}
        center={location ? [location.lat, location.lng] : [0, 0]}
        zoom={location ? 13 : 1}
        dragging={!readonly}
        touchZoom={!readonly}
        doubleClickZoom={!readonly}
        scrollWheelZoom={!readonly}
        boxZoom={!readonly}
        keyboard={!readonly}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FindButtonAndMarker
          readonly={readonly}
          location={location}
          onChange={onChange}
        />
      </MapContainer>
    </div>
  );
}

function FindButtonAndMarker({ readonly, location, onChange }) {
  const [position, setPosition] = useState(location);
  const map = useMapEvents({
    click(e) {
      if (!readonly) {
        handlePositionChange(e.latlng);
      }
    },
    locationfound(e) {
      handlePositionChange(e.latlng);
      map.flyTo(e.latlng, 13);
    },
    locationerror(e) {
      toast.error(e.message);
    },
  });

  const handlePositionChange = useCallback(
    (newPosition) => {
      setPosition(newPosition);
      if (!readonly && onChange) {
        console.log('New Position:', newPosition); // Debugging
        onChange(newPosition);
      }
    },
    [readonly, onChange]
  );

  useEffect(() => {
    if (location) {
      setPosition(location);
    }
  }, [location]);

  useEffect(() => {
    if (readonly && position) {
      map.setView(position, 13);
    }
  }, [position, readonly, map]);

  const markerIcon = new L.Icon({
    iconUrl: '/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

  return (
    <>
      {!readonly && (
        <button
          type="button"
          className={classes.find_location}
          onClick={() => map.locate()}
        >
          Find My Location
        </button>
      )}

      {position && (
        <Marker
          eventHandlers={{
            dragend: (e) => {
              handlePositionChange(e.target.getLatLng());
            },
          }}
          position={position}
          draggable={!readonly}
          icon={markerIcon}
        >
          <Popup>Shipping Location</Popup>
        </Marker>
      )}
    </>
  );
}
