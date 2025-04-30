import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
      const data = await res.json();
      setProfile(data);
    };

    const fetchUser = async () => {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    };

    fetchProfile();
    fetchUser();
  }, [userId]);

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
        </div>
        <hr />
        <div className="profile-info px-3">
          <p><i className="bi bi-person-lines-fill me-2"></i>{profile.description || "No description yet."}</p>
          <p><i className="bi bi-geo-alt-fill me-2"></i>{profile.location || "Unknown location"}</p>
          <p><i className="bi bi-cake me-2"></i>{profile.birthday || "Not specified"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
