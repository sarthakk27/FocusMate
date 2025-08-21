// Example user data (replace with real user data from context or API)
import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const initialUser = {
  name: "Sarthak Kumar",
  email: "sarthak@example.com",
  joined: "March 2024",
  avatar: "https://ui-avatars.com/api/?name=Sarthak+Kumar&background=1976d2&color=fff&size=128",
  bio: "Passionate learner and productivity enthusiast. Loves to set goals and track progress."
};

const Profile = () => {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditing(true);
    setForm({ name: user.name, email: user.email });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, name: form.name, email: form.email });
    setEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.avatar} alt="avatar" className="profile-avatar" />
        <div>
          {editing ? (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="profile-edit-input"
                required
              />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="profile-edit-input"
                required
              />
              <button type="submit" className="profile-save-btn">Save</button>
              <button type="button" className="profile-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            </form>
          ) : (
            <>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
            </>
          )}
        </div>
      </div>
      <div className="profile-bio">
        <h3>About</h3>
        <p>{user.bio}</p>
      </div>
      <div className="profile-stats">
        <h3>Quick Stats</h3>
        <ul>
          <li><strong>Notes Created:</strong> 42</li>
          <li><strong>Goals Achieved:</strong> 7</li>
          <li><strong>Daily Plans Completed:</strong> 15</li>
          <li><strong>Study Sessions Logged:</strong> 28</li>
        </ul>
      </div>
      <div className="profile-actions">
        {!editing && <button className="profile-edit-btn" onClick={handleEdit}>Edit Profile</button>}
        <button className="profile-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
