import React, { useEffect, useState } from 'react';
import { Box, Text, Image, Button, Flex, VStack, Center, Spacer, HStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Sneaker({ addToCart, cart }) {
  const { id } = useParams();
  const [sneaker, setSneaker] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  useEffect(() => {
    const fetchSneaker = async () => {
      try {
        const response = await axios.get(`/api/sneakers/${id}`);
        setSneaker(response.data);
      } catch (error) {
        console.error('Error fetching sneaker:', error);
      }
    };

    fetchSneaker();
  }, [id]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (cart.some((item) => item.id === sneaker.id)) {
      alert('Limit one per order: This sneaker is already in your cart.');
      return;
    }
    else
    {
      alert('Added Successfully:'+sneaker.name+' UK'+selectedSize);
    }

    addToCart(sneaker);
    console.log('Added to Cart:', sneaker.name);
  };

  if (!sneaker) {
    return <p>Loading...</p>;
  }


  
  const shoeSizes = [6, 7, 8, 9, 10, 11, 12];

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  return (
    <Flex mt={8} justifyContent="space-evenly">
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        width="80%"
        bg="#F5F5F5"
        boxShadow="md"
        position="relative"
      >
        <Flex justifyContent={"space-evenly"} alignItems={"start"}>
          <Box width="40vw" height={"70vh"}>
            <Image src={sneaker.image_link} alt={sneaker.name} maxW="100%" />
          </Box>
          <VStack justifyContent={"center"} width="60vw" spacing={4} align="start">
            <Text fontSize="3xl" fontWeight="bold" color="#000">
              {sneaker.name}
            </Text>
            <Text fontSize="lg" color="gray.600">
              Brand: {sneaker.brand}
            </Text>
            <Text fontSize="lg" color="gray.600">
              Price: ₹{sneaker.price.toFixed(2)}
            </Text>
            <Text fontSize="lg" color="gray.600">
              Description: {sneaker.description}
            </Text>
            <HStack spacing={4}>
      {shoeSizes.map((size) => (
        <Button
        width={"5vw"} bgColor={""}
          key={size}
          colorScheme={selectedSize === size ? "blue" : "gray"} // the selected button will be blue
          variant={selectedSize === size ? "solid" : "outline"} // changes the variant upon selection
          onClick={() => handleSizeClick(size)}
        >
          {size}
        </Button>
      ))}
    </HStack>
          </VStack>
        </Flex>
        <Center position="absolute" bottom="20px" right="20px">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Center>
      </Box>
    </Flex>
  );
}

export default Sneaker;
