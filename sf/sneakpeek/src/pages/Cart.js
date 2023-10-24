import React from 'react';
import { Box, Text, Button, Flex, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Cart({ cartItems, removeFromCart }) {
  // Calculate the total price of items in the cart
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <Box
      marginTop={"10vh"}
      marginX={"auto"}
      width={"60vw"}
      textAlign="center"
      color="#000"
      bg="#F1D0B0"
      p={8}
      borderRadius="20px"
      boxShadow="lg"
      fontFamily="Inter, sans-serif"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Shopping Cart
      </Text>
      {cartItems.length === 0 ? (
        <Text mt={4}>Your cart is empty.</Text>
      ) : (
        <>
          {cartItems.map((item) => (
            <Center key={item.id} width={"50vw"} marginX={"auto"}>
              <Flex
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
                m={4}
                bg="#F7F7F7"
                boxShadow="md"
                justifyContent={"space-between"}
                width={"100vw"}
                spacing={4}
              >
                <Flex width={"80vw"} justifyContent={"start"} >
                <Box
            backgroundImage={`url(${item.image_link})`}
            backgroundSize="contain"
            backgroundPosition="center"
            backgroundRepeat={"no-repeat"}
            alt={item.name}
            width="10vw"
            height="10vw"
            borderRadius={"20px"}
          />
                <Flex width={"25vw"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"}>
                  <Text fontSize="lg" textAlign={"left"}fontWeight="bold" color="#000">
                    {item.name}
                  </Text>
                  <Text color="#000">Brand: {item.brand}</Text>
                  <Text fontSize="lg" fontWeight="bold" color="#000">
                    ₹{item.price.toFixed(2)}
                  </Text>
                </Flex>
                </Flex>
                <Box width={"20vw"}>
                  <Button
                    colorScheme="red"
                    mt={2}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </Box>
              </Flex>
            </Center>
          ))}
          <Text fontSize="lg" fontWeight="bold" mt={4} color="#000">
            Total: ₹{totalPrice.toFixed(2)}
          </Text>
          <Link to="/pay" style={{ textDecoration: 'none' }}>
            <Button
              colorScheme="green"
              mt={4}
              size="lg"
              position="fixed"
              bottom="20px"
              right="20px"
              fontFamily="Inter, sans-serif"
            >
              Place Order
            </Button>
          </Link>
        </>
      )}
    </Box>
  );
}

export default Cart;
