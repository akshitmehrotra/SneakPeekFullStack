import React, { useState, useEffect } from 'react';
import {
  CSSReset,
  Container,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  List,
  ListItem,
  Textarea,
  Text,
  Flex, // Added Flex for better layout
  Stack, // Added Stack for better spacing
  Divider, // Added Divider for separation
} from '@chakra-ui/react';
import axios from 'axios';

function Admin() {
  const [sneakers, setSneakers] = useState([]);
  const [newSneaker, setNewSneaker] = useState({
    name: '',
    price: '',
    brand: '',
    image_link: '',
    description: '', // Keep the description field
  });

  // State to keep track of the sneaker being edited
  const [editingSneakerId, setEditingSneakerId] = useState(null);

  useEffect(() => {
    fetchSneakers();
  }, []);

  const fetchSneakers = async () => {
    try {
      const response = await axios.get('/api/sneakers');
      setSneakers(response.data);
    } catch (error) {
      console.error('Error fetching sneakers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSneaker((prevSneaker) => ({
      ...prevSneaker,
      [name]: value,
    }));
  };

  const handleAddSneaker = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sneakers', newSneaker);
      setNewSneaker({
        name: '',
        price: '',
        brand: '',
        image_link: '',
        description: '',
      });
      fetchSneakers();
    } catch (error) {
      console.error('Error adding sneaker:', error);
    }
  };

  const handleDeleteSneaker = async (id, e) => {
    try {
      await axios.delete(`/api/sneakers/${id}`);
      fetchSneakers();
    } catch (error) {
      console.error('Error deleting sneaker:', error);
    }
  };

  const handleEditSneaker = (id) => {
    const editingSneaker = sneakers.find((sneaker) => sneaker.id === id);

    if (editingSneaker) {
      setNewSneaker({
        name: editingSneaker.name,
        price: editingSneaker.price,
        brand: editingSneaker.brand,
        image_link: editingSneaker.image_link,
        description: editingSneaker.description || '',
      });
      setEditingSneakerId(id);
    }
  };

  const handleUpdateSneaker = async (id, updatedSneaker) => {
    try {
      await axios.put(`/api/sneakers/${id}`, updatedSneaker);
      setEditingSneakerId(null);
      fetchSneakers();
    } catch (error) {
      console.error('Error updating sneaker:', error);
    }
  };

  return (
    <div>
      <CSSReset />
      <Container maxW="container.md">
        <Box mt={4}>
          <h2>Add a New Sneaker</h2>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={newSneaker.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Price</FormLabel>
            <Input
              type="text"
              name="price"
              value={newSneaker.price}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Brand</FormLabel>
            <Input
              type="text"
              name="brand"
              value={newSneaker.brand}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Image Link</FormLabel>
            <Input
              type="text"
              name="image_link"
              value={newSneaker.image_link}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={newSneaker.description}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button onClick={handleAddSneaker}>Add Sneaker</Button>
        </Box>

        <Divider my={4} /> {/* Added a divider for separation */}

        <Box mt={4}>
          <h2>Sneaker List</h2>
          <List>
            {sneakers.map((sneaker) => (
              <ListItem key={sneaker.id}>
                {editingSneakerId === sneaker.id ? (
                  <>
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        type="text"
                        name="name"
                        value={newSneaker.name}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Price</FormLabel>
                      <Input
                        type="text"
                        name="price"
                        value={newSneaker.price}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Brand</FormLabel>
                      <Input
                        type="text"
                        name="brand"
                        value={newSneaker.brand}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Image Link</FormLabel>
                      <Input
                        type="text"
                        name="image_link"
                        value={newSneaker.image_link}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        value={newSneaker.description}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <Button
                      onClick={() => handleUpdateSneaker(sneaker.id, newSneaker)}
                    >
                      Update
                    </Button>
                  </>
                ) : (
                  <Stack spacing={2}> {/* Added a Stack for better spacing */}
                    <Text fontWeight="bold">Name: {sneaker.name}</Text>
                    <Text>Brand: {sneaker.brand}</Text>
                    <Text>Price: {sneaker.price}</Text>
                    <Text>Description: {sneaker.description || 'N/A'}</Text>
                    <Button
                      onClick={() => handleDeleteSneaker(sneaker.id)}
                      colorScheme="red"
                      size="sm"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleEditSneaker(sneaker.id)}
                      colorScheme="blue"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </Stack>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </div>
  );
}

export default Admin;
