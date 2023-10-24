import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box, Text, Image } from '@chakra-ui/react';
import axios from 'axios';
import {
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

function NavBar({ updateUser, setUseridentification, setSearchTerm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(1); // Initialize isAdmin as false
  const [search, setSearch] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Fetch the isAdmin status when the component mounts
    axios
      .get(`http://localhost:5002/api/user/${username}/isAdmin`)
      .then((response) => {
        setIsAdmin(response.data.isAdmin);
      })
      .catch((error) => {
        console.error('Error fetching isAdmin status:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Local state change
    setSearchTerm(e.target.value); // Update the state in the App component
  };

  const handleSignup = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5002/signup', { username, password })
      .then((response) => {
        setError('');
        setUsername('');
        setPassword('');
        onClose();
        alert('Signup successful'); // Show success message
      })
      .catch((error) => {
        setError('Error signing up.');
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5002/login', { username, password })
      .then((response) => {
        setToken(response.data.token);
        setUsername(username); // Set the username state here
        setPassword('');
        updateUser(username);
        setUseridentification(username);
        onClose();
        alert('Login successful');
      })
      .catch((error) => {
        setError('Invalid username or password.');
      });
  };

  return (
    <Flex as="nav" position="sticky" top="0" zIndex={3} alignItems="center" justify="space-between" p={4} height="15vh" bg="#fef6e7" color="#000">
      {token ? (
        <Flex flexDirection={''} width={'25vw'} justifyContent={'space-evenly'} alignItems={'center'}>
        <Text align={"center"}>{username}</Text>
        <Link to="/order" style={{ textDecoration: 'none' }}>
        <Button colorScheme='blue'>
        Orders
        </Button>
        </Link>
        </Flex>
      ) : (
        // Display the "Signup / Login" button if the user is not logged in
        <>
        <Box width={"25vw"}>
          <Button onClick={onOpen} bgColor={"#fef6e7"}>
          <Image src='https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png' boxSize={"50px"}/> 
          </Button>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Login / Signup</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  mb={4}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  mb={4}
                />
                {error && <Text color="red">{error}</Text>} {/* Display error message */}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSignup}>
                  Signup
                </Button>
                <Button colorScheme="green" onClick={handleLogin}>
                  Login
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}

      <Flex width={"50vw"} alignItems={"center"} justifyContent={"center"}> 
        <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>
          <Image borderRadius={"full"} src='https://i.imgur.com/IKC9qDp.png' boxSize={"100px"}/> 
        </Link>
      </Flex>

      <Flex width={"25vw"} alignItems={"center"} justifyContent={'space-between'}>
      <Input 
        type="text"
        placeholder="Search for sneakers..."
        value={search}
        width={"20vw"}
        onChange={handleSearchChange}
      />
        <Link to="/cart" style={{ textDecoration: 'none', color: '#000' }}>
        <Image src='https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/cart-icon.png' boxSize={"50px"}/> 
        </Link>
      </Flex>
    </Flex>
  );
}

export default NavBar;
