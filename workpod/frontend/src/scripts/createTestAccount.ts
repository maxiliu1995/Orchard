const axios = require('axios');

async function createTestAccount() {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  try {
    console.log('Attempting to create test account...');
    const response = await axios.post('http://localhost:3001/api/users/signup', testUser);
    
    if (response.data.startsWith('<!DOCTYPE html>')) {
      console.error('Received HTML response instead of JSON. Are you connecting to the correct server?');
      return;
    }
    
    console.log('Test account created successfully:', response.data);
  } catch (error: any) {
    console.error('Failed to create test account:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

createTestAccount(); 