import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../hooks/deleteUserHook';
import '../styles/profile.css';
import avatar from '../assets/avatar.jpg';

const Profile = () => {
    let navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    console.log(baseUrl);

    // Menu items
    const items = [
        { label: 'Profile', icon: 'pi pi-palette', url: '/profile' },
        { label: 'Booked Events', icon: 'pi pi-link', url: '/eventprofile' },
        { label: 'Booked Tickets', icon: 'pi pi-home', url: '/ticketprofile' }
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

    // Fetch user data
    useEffect(() => {
        const fetchData = async (username) => {
            try {
                const response = await fetch(`${baseUrl}user/${username}`);
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

        const loggedUsername = sessionStorage.getItem('username');
        fetchData(loggedUsername);
    }, []);

    // Handle delete user
    const handleDelete = async (e) => {
        e.preventDefault();
        deleteUser(userDetails.username);
        navigate('/');
    };

    // Navigate to ResetPassword component
    const handleResetPassword = () => {
        navigate('/resetpassword');
    };

    return (
        <div className="main-container">
            <div className="left-sidebar">
                <Menu model={items} />
            </div>
            <div className="profile-section">
                <Divider />
                <Card title={<Avatar image={avatar} label={userDetails.name.charAt(0)}
                                     style={{ width: '100px', height: '100px', fontSize: '50px' }} />}
                      className="profile-card"> {/* Avatar component */}
                    {error && <p className="error-message">Error: {error}</p>}
                    <div className="profile-details">
                        <p><span className="profile-label">Name:</span> {userDetails.name}</p>
                        <p><span className="profile-label">Username:</span> {userDetails.username}</p>
                        <p><span className="profile-label">Phone:</span> {userDetails.phone}</p>
                        <p><span className="profile-label">Email:</span> {userDetails.email}</p>
                    </div>
                </Card>
                <div className="profile-buttons">
                    <Button label="Edit" icon="pi pi-pencil"
                            className="p-button-raised p-button-rounded p-button-primary"
                            onClick={() => navigate('/editprofile')} />
                    <Button label="Reset Password" icon="pi pi-refresh"
                            className="p-button-raised p-button-rounded p-button-secondary"
                            onClick={handleResetPassword} />
                    <Button label="Delete Profile" icon="pi pi-trash"
                            className="p-button-raised p-button-rounded p-button-danger" onClick={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
