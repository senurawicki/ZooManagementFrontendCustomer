import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../hooks/deleteUserHook';
import '../styles/profile.css';

const Profile = () => {
    let navigate = useNavigate();

    // Menu items
    const items = [
        { label: 'Profile', icon: 'pi pi-palette', url: '/profile' },
        { label: 'Events', icon: 'pi pi-link', url: '/profile/event' },
        { label: 'Tickets', icon: 'pi pi-home', url: '/profile/ticket' }
    ];

    // State for user details
    const [userDetails, setUserDetails] = useState({
        name: '',
        username: '',
        phone: '',
        email: '',
        password: ''
    });

    // State for error
    const [error, setError] = useState(null);

    // State for right sidebar
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [rightSidebarContent, setRightSidebarContent] = useState(null);

    // Fetch user data
    useEffect(() => {
        const fetchData = async (username) => {
            try {
                const response = await fetch(`http://localhost:8080/user/${username}`);
                const data = await response.json();
                setUserDetails({
                    name: data.name || '',
                    username: data.username || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    password: data.password || ''
                });
            } catch (err) {
                setError(err.message);
            }
        };

        const loggedUsername = sessionStorage.getItem('loggedUserDetails');
        fetchData(loggedUsername);
    }, []);

    // Handle delete user
    const handleDelete = async (e) => {
        e.preventDefault();
        deleteUser(userDetails.username);
        navigate('/');
    };

    // Function to handle right sidebar content
    const handleRightSidebar = (content) => {
        setShowRightSidebar(true);
        setRightSidebarContent(content);
    };

    return (
        <div className="main-container">
            <div className="left-sidebar">
                <Menu model={items} />
            </div>
            <div className="profile-section">
                <Divider />
                <Card title={userDetails.name || 'User Name'} className="profile-card">
                    {error && <p className="error-message">Error: {error}</p>}
                    <div className="profile-details">
                        <p><span className="profile-label">Name:</span> {userDetails.name}</p>
                        <p><span className="profile-label">Username:</span> {userDetails.username}</p>
                        <p><span className="profile-label">Phone:</span> {userDetails.phone}</p>
                        <p><span className="profile-label">Email:</span> {userDetails.email}</p>
                        <p><span className="profile-label">Password:</span> {userDetails.password}</p>
                    </div>
                </Card>
                <div className="profile-buttons">
                    <Button label="Edit" icon="pi pi-pencil" className="p-button-raised p-button-rounded p-button-primary" onClick={() => navigate('/editprofile')} />
                    <Button label="Delete Profile" icon="pi pi-trash" className="p-button-raised p-button-rounded p-button-danger" onClick={handleDelete} />
                </div>
            </div>
            {showRightSidebar && (
                <div className="right-sidebar">
                    Booked Tickets details
                    {/* Display rightSidebarContent */}
                    {rightSidebarContent}
                </div>
            )}
        </div>
    );
};

export default Profile;