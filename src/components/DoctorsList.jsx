import React, { useEffect, useState } from 'react';
import '../styles/DoctorsList.css';
import axios from 'axios';
import DoctorCard from './DoctorCard';
import { useSearchContext } from '../context/SearchContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DoctorsList = () => {
  const { searchState } = useSearchContext();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDoctorId, setHoveredDoctorId] = useState(null); // Track hovered doctor by ID

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
        setError('Failed to fetch doctors. Please try again later.');
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

  return (
    <div className="doctors-page">
      {/* Left Side: Doctors List */}
      <div className="doctors-list">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onHover={() => {
              console.log(doctor.profile_pic);
              setHoveredDoctorId(doctor.id);
            }}
            onLeave={() => setHoveredDoctorId(null)} // Reset hovered doctor ID
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
                  mouseover: (e) => {
                    e.target.openPopup(); // Open popup on hover
                  },
                  mouseout: (e) => {
                    e.target.closePopup(); // Close popup when mouse leaves
                  },
                }}
              >
                {/* Conditionally show Popup if this marker matches hoveredDoctorId */}
                {hoveredDoctorId === doctor.id && (
                  <Popup>
                    <strong>{doctor.first_name} {doctor.last_name}</strong><br />
                    Specialty: {doctor.specialty}<br />
                    Hospital: {doctor.hospital_name}
                  </Popup>
                )}
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
