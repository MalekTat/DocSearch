import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DoctorDetail.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/doctors/${id}`);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const renderStars = (rate) => {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="doctor-rating">
        {'★'.repeat(fullStars)}
        {halfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div className="doctor-detail-page">
      <div className="doctor-detail-card">
        <img src={doctor.profile_pic} alt={`${doctor.firstName} ${doctor.lastName}`} className="doctor-detail-image" />
        <div className="doctor-detail-info">
          <h1>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h1>
          <div className="doctor-rating-container">
            {renderStars(doctor.rate)}
            <span>{`(${doctor.rate}/5)`}</span>
          </div>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
          <p><strong>Hospital:</strong> {`${doctor.street_number} ${doctor.street_name}, ${doctor.city}, ${doctor.country}`}</p>
          <p><strong>Opening Hours:</strong> {doctor.opening_hour}</p>
          <p><strong>Languages:</strong> {doctor.languages}</p>
          <p><strong>Insurance:</strong> {doctor.insurance}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone_number}</p>
        </div>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to List
      </button>
    </div>
  );
};

export default DoctorDetail;