import { Box, Flex, Text } from '@chakra-ui/react';
import LoginForm from '../components/LoginForm';

function Login() {
    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
        <Box w="100%" maxW="md" p={6}>
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
            Welcome Back 👋
            </Text>
            <LoginForm />
        </Box>
        </Flex>
    );
}

export default Login;
