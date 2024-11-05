import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
  
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }
  
    console.log('Submitting form with data:', formData); // Log the data being sent
  
    try {
      const response = await axios.post('https://passop-api-heycharm.vercel.app/api/auth/registration', formData);
      setSuccess('Registration successful!');
      setError('');
      // Reset form or redirect user as needed
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
  console.error('Error during registration:', err.response ? err.response.data : err);
  setError(err.response ? err.response.data.msg || 'Registration failed' : 'Server not reachable');
  setSuccess('');
}
  };
  

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Registration Form</h1>
      <form className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            type="text" id="name" name="name" placeholder="John Doe" onChange={handleChange} required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            type="email" id="email" name="email" placeholder="john@example.com" onChange={handleChange} required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            type="text" id="phone" name="phone" placeholder="1234567890" onChange={handleChange} required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            type="password" id="password" name="password" placeholder="********" onChange={handleChange} required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            type="password" id="confirm-password" name="confirmPassword" placeholder="********" onChange={handleChange} required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
        {success && <p className="text-green-500 text-sm">{success}</p>} {/* Display success message */}
        <button
          className="w-full bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          type="submit"
        >Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
