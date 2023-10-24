import React from "react";
import { Box, Image, Text, Flex } from "@chakra-ui/react";

function SneakerHolder({ sneaker }) {
  const primaryColor = "#F2d0b0"; // Define your primary color
  const secondaryColor = "#000"; // Define your secondary color

  return (
    <Box
      marginLeft="0.25vw"
      marginRight="0.25vw"
      width="24vw"
      height="60vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      marginTop="2vh"
      backgroundColor={primaryColor} // Use primary color as the background
      color={secondaryColor} // Use secondary color for text
      padding="1rem" // Add some padding for spacing
      borderRadius="8px" // Add rounded corners
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Add a subtle box shadow
    >
      {sneaker.name && (
        <>
        <Flex flexDirection={"column"} alignItems="center"
      justifyContent="flex-start">
          <Box
            backgroundImage={`url(${sneaker.image_link})`}
            backgroundSize="contain"
            backgroundPosition="center"
            backgroundRepeat={"no-repeat"}
            alt={sneaker.name}
            width="20vw"
            height="35vh"
            marginBottom="1rem" 
            padding={"1rem"}
            borderRadius={"20px"}
          />
          <Box width={"20vw"}>
          <Text textAlign="center" fontWeight="bold">{sneaker.name}</Text>
          <Text textAlign="center" fontSize="sm">Brand: {sneaker.brand}</Text>
          <Text textAlign="center" fontSize="lg">Price: ₹{sneaker.price.toFixed(2)}</Text>
          </Box>
          </Flex>
        </>

      )}
    </Box>
  );
}

export default SneakerHolder;
