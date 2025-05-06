import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { id } = useParams();
  const userId = parseInt(id);

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    profilePicture: "",
    birthday: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);

        if (res.status === 404) {
          const created = await fetch(`http://localhost:5000/api/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              description: "New user. Add a description!",
              location: "Unknown",
              profilePicture: "",
              birthday: ""
            })
          });
          const createdData = await created.json();
          setProfile(createdData);
          setFormData(createdData);
        } else {
          const data = await res.json();
          setProfile(data);
          setFormData({
            description: data.description || "",
            location: data.location || "",
            profilePicture: data.profilePicture || "",
            birthday: data.birthday || ""
          });
        }
      } catch (error) {
        console.error("Error fetching/creating profile:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (!isNaN(userId)) {
      fetchProfile();
      fetchUser();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.description.trim() === "" || formData.location.trim() === "") {
      alert("Description and Location are required.");
      return;
    }

    if (formData.profilePicture && !formData.profilePicture.startsWith("http")) {
      alert("Profile picture must be a valid URL.");
      return;
    }
    
    const payload = {
      ...formData,
      userId 
    };

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setShowModal(false);
        setSuccessMessage("Profilul a fost actualizat cu succes!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("Something went wrong while updating the profile.");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Server error.");
    }
  };

  if (!profile || !user) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 profile-wrapper">
      <div className="card shadow-lg p-4 rounded profile-card">
        <div className="text-center">
          <img
            src={profile.profilePicture || "/default-profile.jpg"}
            alt="Profile"
            className="profile-picture mb-3"
          />
          <h2 className="profile-name">{user.name}</h2>
          <button className="btn btn-outline-primary mt-3" onClick={() => setShowModal(true)}>
            Edit Profile
          </button>
          {successMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {successMessage}
            </div>
          )}
        </div>
        <hr />
        <div className="profile-info px-3">
          <p><i className="bi bi-person-lines-fill me-2"></i>{profile.description || "No description yet."}</p>
          <p><i className="bi bi-geo-alt-fill me-2"></i>{profile.location || "Unknown location"}</p>
          <p><i className="bi bi-cake me-2"></i>{profile.birthday || "Not specified"}</p>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Profile Picture URL</label>
                    <input
                      type="text"
                      name="profilePicture"
                      className="form-control"
                      value={formData.profilePicture}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Birthday</label>
                    <input
                      type="date"
                      name="birthday"
                      className="form-control"
                      value={formData.birthday}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
