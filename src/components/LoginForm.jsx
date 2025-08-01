import {
  Box, Button, FormControl, FormLabel,
  Input, Heading, Text, VStack, Alert
} from '@chakra-ui/react';
import { useState } from 'react';
import { login } from '../api/auth';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(form.username, form.password);
      console.log('Login successful:', res.data.data.token);
      saveToken(res.data.data.token);
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading mb={6}>Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {error && <Alert status="error">{error}</Alert>}

          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
            />
          </FormControl>

          <Button colorScheme="teal" type="submit" width="full">
            Login
          </Button>
        </VStack>
      </form>
      <Text mt={4}>
        Don't have an account? <a href="/register" style={{ color: '#3182ce' }}>Register</a>
      </Text>
    </Box>
  );
}

export default LoginForm;