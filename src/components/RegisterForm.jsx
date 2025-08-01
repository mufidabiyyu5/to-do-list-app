// components/RegisterForm.jsx
import {
  Box, Button, FormControl, FormLabel,
  Input, Heading, VStack, Alert, Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading mb={6}>Register</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {error && <Alert status="error">{error}</Alert>}

          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Choose a username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Choose a password"
            />
          </FormControl>

          <Button colorScheme="teal" type="submit" width="full">
            Register
          </Button>
        </VStack>
      </form>
      <Text mt={4}>
        Already have an account? <a href="/login" style={{ color: '#3182ce' }}>Login</a>
      </Text>
    </Box>
  );
}

export default RegisterForm;
