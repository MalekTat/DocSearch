import React, { useEffect, useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import '../styles/AdminPage.css';
import Map from '../components/Map';

  
const AdminPage = () => {
  const { isAdmin } = useAuthContext();

  if (!isAdmin) {
    return <p>You must be logged in as an admin to access this page.</p>;
  }

  const navigate = useNavigate();
  const [image, setImage] = useState('')
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState({ firstName: '', lastName: '', city: '' });
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    profile_pic: '',
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
    insurance: '',
    latitude: '',
    longitude:''
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

  const handleSearch = () => {
    return doctors.filter(
      (doctor) =>
        doctor.firstName.toLowerCase().includes(search.firstName.toLowerCase()) &&
        doctor.lastName.toLowerCase().includes(search.lastName.toLowerCase()) &&
        doctor.city.toLowerCase().includes(search.city.toLowerCase())
    );
  };

  const totalCities = [...new Set(doctors.map((doc) => doc.city))].length;


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





  // Geocoding Function with Nominatim
  const getCoordinatesWithNominatim = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: address,
            format: 'json',
          },
        }
      );
  
      if (response.data.length === 0) {
        return { lat: 0 , lon: 0 };
      }
  
      const { lat, lon } = response.data[0]; // Get the first result
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };




  const updateCoordinates = async () => {
    const address = `${formData.street_number} ${formData.street_name}, ${formData.city}, ${formData.postal_code}, ${formData.country}`;
    const coordinates = await getCoordinatesWithNominatim(address);
  
    if (coordinates) {
      setFormData((prev) => ({
        ...prev,
        latitude: coordinates.lat,
        longitude: coordinates.lon,
      }));
    }
  };

  const handleAddOrUpdate = async (e) => {
  e.preventDefault();
  const largestId = doctors.reduce((max, doctor) => Math.max(max, doctor.id), 0);
  const newId = isEditing ? formData.id : largestId + 1;

  const newDoctorData = {...formData, id: newId};

  // Fetch address coordinates
  if(!isEditing) {
  const address = `${formData.street_number} ${formData.street_name}, ${formData.city}, ${formData.postal_code}, ${formData.country}`;
  const coordinates = await getCoordinatesWithNominatim(address);
  newDoctorData.latitude = coordinates.lat;
  newDoctorData.longitude = coordinates.lon;
  } 


  if (image) {
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'docsearch'); 

      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dhvyrgmrq/image/upload',
        formData
      );

      newDoctorData.profile_pic = res.data.url; 
    } catch (err) {
      console.error('Error uploading image:', err);
      return; // Stop execution if the image upload fails
    }
    setImage('');
  }

  try {
    if (isEditing) {
      await axios.put(`http://localhost:5005/doctors/${formData.id}`, newDoctorData);
    } else {
      await axios.post(`http://localhost:5005/doctors/`, newDoctorData);
    }

    // Reset form data and close dialog
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      profile_pic: '',
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
      insurance: '',
      latitude: '',
      longitude:''
    });

    setIsEditing(false);
    setShowDialog(false);
    fetchDoctors(); // Refresh the list
  } catch (error) {
    console.error('Error saving doctor:', error);
  }
};


const resetDialog = () => {
  setIsEditing(false);
  setShowDialog(false);
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
    latitude: '',
    longitude:''
  });
};










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
            {/* Row 1: First Name, Last Name, Gender */}
            <div className="form-row">
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
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Row 2: Profile Pic Upload, Specialty */}
            <div className="form-row">
              <input
                   type="file"
                    onChange={(e) => setImage(e.target.files[0])} // Get the selected file
              />
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                required
              >
                <option value="">Select Specialty</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                {/* Add more specialties */}
              </select>
              <input
                type="text"
                placeholder="Languages"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              />
            </div>

            {/* Row 3: Email, Phone Number */}
            <div className="form-row">
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
            </div>

            {/* Row 4: Country, City, Postal Code */}
            <div className="form-row">
              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => {
                  setFormData({ ...formData, country: e.target.value });
                  updateCoordinates();
                }}
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  updateCoordinates();
                }}
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postal_code}
                onChange={(e) => {
                  setFormData({ ...formData, postal_code: e.target.value });
                  updateCoordinates();
                }}
              />
            </div>

            {/* Row 5: Street Name, Street Number */}
            <div className="form-row">
              <input
                type="text"
                placeholder="Street Name"
                value={formData.street_name}
                onChange={(e) => {
                  setFormData({ ...formData, street_name: e.target.value });
                  updateCoordinates();
                }}
              />
              <input
                type="text"
                placeholder="Street Number"
                value={formData.street_number}
                onChange={(e) => {
                  setFormData({ ...formData, street_number: e.target.value });
                  updateCoordinates();
                }}
              />
            </div>

            {/* Row 6: Languages, Opening Hour, Insurance */}
            <div className="form-row">
              
              <input
                type="text"
                placeholder="Opening Hour (e.g., 9:00 AM)"
                value={formData.opening_hour}
                onChange={(e) => setFormData({ ...formData, opening_hour: e.target.value })}
              />
              <input
                type="text"
                placeholder="Insurance (e.g., public, private)"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
              />
              
            </div>

            {/* Map */}
            <Map lat={formData.latitude} lon={formData.longitude} />

            {/* Form Buttons */}
            <div className="form-actions">
              <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
              <button type="button" onClick={resetDialog}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default AdminPage;