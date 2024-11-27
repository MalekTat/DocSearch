import React, { useEffect, useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const { isAdmin } = useAuthContext();

  if (!isAdmin) {
    return <p>You must be logged in as an admin to access this page.</p>;
  }

  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState({ firstName: '', lastName: '', city: '' });
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    profile_pic: 'https://xsgames.co/randomusers/avatar.php?g=Male',
    email: '',
    phone_number: '',
    specialty: '',
    gender: 'Male',
    country: '',
    city: '',
    postal_code: '',
    street_name: '',
    street_number: '',
    opening_hour: '',
    languages: '',
    insurance: 'both public and private',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5005/doctors/');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/doctors/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5005/doctors/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:5005/doctors/', formData);
      }

      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        profile_pic: 'https://xsgames.co/randomusers/avatar.php?g=Male',
        email: '',
        phone_number: '',
        specialty: '',
        gender: 'Male',
        country: '',
        city: '',
        postal_code: '',
        street_name: '',
        street_number: '',
        opening_hour: '',
        languages: '',
        insurance: 'both public and private',
      });

      setIsEditing(false);
      setShowDialog(false);
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleSearch = () => {
    return doctors.filter(
      (doctor) =>
        doctor.firstName.toLowerCase().includes(search.firstName.toLowerCase()) &&
        doctor.lastName.toLowerCase().includes(search.lastName.toLowerCase()) &&
        doctor.city.toLowerCase().includes(search.city.toLowerCase())
    );
  };

  const totalCities = [...new Set(doctors.map((doc) => doc.city))].length;

  return (
    <div className="admin-page">
      {/* Top Stats and Add Button */}
      <div className="admin-stats">
        <p>Total Doctors: {doctors.length}</p>
        <p>Total Cities: {totalCities}</p>
        <button onClick={() => setShowDialog(true)} className="add-button">
          Add
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by First Name"
          value={search.firstName}
          onChange={(e) => setSearch({ ...search, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Last Name"
          value={search.lastName}
          onChange={(e) => setSearch({ ...search, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by City"
          value={search.city}
          onChange={(e) => setSearch({ ...search, city: e.target.value })}
        />
      </div>

      {/* Doctor List Section */}
      <div className="admin-doctor-list">
        <h2>Doctor List</h2>
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Specialty</th>
              <th>City</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {handleSearch().map((doctor) => (
              <tr key={doctor.id} onClick={() => navigate(`/doctor/${doctor.id}`)} >
                <td>
                  <img
                    src={doctor.profile_pic}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="doctor-profile-pic"
                  />
                </td>
                <td>{doctor.firstName}</td>
                <td>{doctor.lastName}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.city}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phone_number}</td>
                <td>
                  <button onClick={(e) => {
                    e.stopPropagation(); 
                    handleEdit(doctor);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doctor.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog Box for Adding/Editing */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>{isEditing ? 'Edit Doctor' : 'Add Doctor'}</h2>
            <form onSubmit={handleAddOrUpdate}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Profile Picture URL"
                value={formData.profile_pic}
                onChange={(e) => setFormData({ ...formData, profile_pic: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
              <input
                type="text"
                placeholder="Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setShowDialog(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;