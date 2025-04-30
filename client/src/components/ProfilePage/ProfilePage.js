import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch profile
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    // Fetch user
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
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
        <div className="profile-info">
          <p><strong>Description:</strong> {profile.description || "Not added yet."}</p>
          <p><strong>Location:</strong> {profile.location || "Not specified"}</p>
          <p><strong>Birthday:</strong> {profile.birthday || "Not set"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
