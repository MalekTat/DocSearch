import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorsList.css';
import axios from 'axios';
import DoctorCard from './DoctorCard';
import { useSearchContext } from '../context/SearchContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

const DoctorsList = () => {
  const { searchState } = useSearchContext();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDoctorId, setHoveredDoctorId] = useState(null); // Track hovered doctor by ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:5005/doctors/', {
          params: {
            city: searchState.city,
            specialty: searchState.specialty,
          },
        });
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchState.city, searchState.specialty]);

  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  });


  return (
    <div className="doctors-page">
      {/* Left Side: Doctors List */}
      <div className="doctors-list">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onHover={() => setHoveredDoctorId(doctor.id)}
            onLeave={() => setHoveredDoctorId(null)} // Reset hovered doctor ID
            onClick={() => navigate(`/doctor/${doctor.id}`)} 
          />
        ))}
      </div>

      {/* Right Side: Map */}
      <div className="map-part">
        <div className="doctors-map">
            <MapContainer
                center={[doctors[0]?.latitude || 0, doctors[0]?.longitude || 0]} // Default to first doctor's location
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {doctors.map((doctor) => (
                <Marker
                  key={doctor.id}
                  position={[doctor.latitude, doctor.longitude]}
                  eventHandlers={{
                    mouseover: (e) => e.target.openPopup(), // Show popup on hover
                    mouseout: (e) => e.target.closePopup(), // Hide popup when mouse leaves
                    click: () => setHoveredDoctorId(doctor.id), // Track clicked doctor for interactions
                  }}
                >
                  <Popup>
                    <strong>{doctor.firstName} {doctor.lastName}</strong><br />
                    Specialty: {doctor.specialty}<br />
                    Hospital: {doctor.hospital_name || doctor.street_name}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
