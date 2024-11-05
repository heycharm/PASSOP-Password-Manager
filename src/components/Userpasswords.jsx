// components/UserPasswords.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPasswords = () => {
    const [passwords, setPasswords] = useState([]);

    useEffect(() => {
        const fetchPasswords = async () => {
            try {
                const response = await axios.get('/api/passwords', { withCredentials: true });
                setPasswords(response.data);
            } catch (error) {
                console.error("Error fetching passwords:", error);
            }
        };

        fetchPasswords();
    }, []);

    return (
        <div>
            <h2>Your Saved Passwords</h2>
            <ul>
                {passwords.map(password => (
                    <li key={password._id}>
                        Platform: {password.platform} - Password: {password.password}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserPasswords;
