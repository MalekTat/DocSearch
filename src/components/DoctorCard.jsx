import React from 'react';
import '../styles/DoctorCard.css';

const DoctorCard = ({ doctor, onHover, onLeave }) => {
  const renderStars = (rate) => {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  return (
    <div
      className="doctor-card"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="doctor-card-header">
        <img src={doctor.profile_pic} alt={`${doctor.firstName} ${doctor.lastName}`} className="doctor-profile-pic" />
        {console.log(doctor.profile_pic)}
        <div className="doctor-rating">{renderStars(doctor.rate)}</div>
      </div>
      <div className="doctor-info">
        <h2>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h2>
        <p><strong>Specialty:</strong> {doctor.specialty}</p>
        <p><strong>Hospital:</strong> {`${doctor.street_number} ${doctor.street_name}, ${doctor.city}, ${doctor.country}`}</p>
        <p><strong>Opening Hours:</strong> {doctor.opening_hour}</p>
        <p><strong>Languages:</strong> {doctor.languages}</p>
        <p><strong>Insurance:</strong> {doctor.insurance}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Phone:</strong> {doctor.phone_number}</p>
      </div>
    </div>
  );
};

export default DoctorCard;
