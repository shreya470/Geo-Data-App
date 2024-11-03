import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, GeoJSON } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import axios from 'axios';

function MyMap() {
  const { filename } = useParams();
  const [color, setColor] = useState("Green");
  const [mapData, setMapData] = useState(null);

  const colorOptions = ["Green", "Blue", "Yellow", "Orange", "Violet", "Red"];

  useEffect(() => {
    fetchData(filename);
  }, [filename]); // Fetch data whenever filename changes

  const fetchData = async (filename) => {
    try {
      const response = await axios.post('http://localhost:3001/mymap/fetch', { name: filename });
      setMapData(response.data.data); // Access response.data.data to get the actual map data
    } catch (error) {
      console.error('Error fetching map data:', error);
    }
  };

  const countryStyle = () => ({
    fillColor: color,
    fillOpacity: 0.8,
    color: "black",
    weight: 2,
  });

  const highlightSelectedCountry = (event) => {
    event.target.setStyle({
      color: color,
      fillColor: color,
    });
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.ADMIN;
    console.log(countryName);
    layer.bindPopup(countryName);
    layer.on({
      click: highlightSelectedCountry,
    });
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>My Map</h1>
      {mapData && (
        <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]}>
          <GeoJSON style={countryStyle} data={mapData.features} onEachFeature={onEachCountry}></GeoJSON>
        </MapContainer>
      )}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <label>Choose Color: </label>
        <select onChange={handleColorChange} value={color}>
          {colorOptions.map((option, index) => (
            <option key={index} value={option} style={{ color: option }}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default MyMap;
