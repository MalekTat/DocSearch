import React from 'react';
import { useAuthContext } from '../context/AuthContext';

const DoctorPage = () => {
  const { isDoctor } = useAuthContext();

  if (!isDoctor) {
    return <p>You must be logged in as a doctor to access this page.</p>;
  }

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>Manage your profile and view appointments here.</p>
    </div>
  );
};

export default DoctorPage;