import React, { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import SneakerHolder from "./SneakerHolder";
import axios from "axios"; // Import axios
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { motion } from 'framer-motion';
function SneakerRow({ searchTerm }) {
  const [sneakers, setSneakers] = useState([]); // State to hold sneakers

  useEffect(() => {
    axios.get('/api/sneakers')
      .then((response) => {
        if (searchTerm) {
          // If there is a searchTerm, we filter the sneakers
          const filteredSneakers = response.data.filter((sneaker) =>
            sneaker.name.toLowerCase().includes(searchTerm.toLowerCase())||sneaker.brand.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSneakers(filteredSneakers);
        } else {
          // If there is no searchTerm, set all sneakers
          setSneakers(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching sneakers:", error);
      });
  }, [searchTerm]); // The empty dependency array ensures this effect runs only once

  // Function to chunk an array into groups of a specified size
  function chunkArray(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  }

  const sneakersInRows = chunkArray(sneakers, 4); // Split sneakers into rows

  return (
    <Box marginX={"auto"} width={"98vw"} marginTop={0}>
      {sneakersInRows.map((sneakersInRow, rowIndex) => (
        <Flex
          key={rowIndex}
          flexWrap="wrap"
          justify="start"
          marginBottom="2vw" // Add manual margin in vw units for spacing
          style={{
            display: sneakersInRow.length === 0 ? "none" : "flex",
          }} // Use inline style to hide rows with no sneakers
        >
          {sneakersInRow.map((sneaker, index) => (
            // Use Link to navigate to the Sneaker page with the specific sneaker's ID as a URL parameter
            <Link
              key={index}
              to={`/sneakers/${sneaker.id}`}
              style={{ textDecoration: "none" }}
              data-aos="fade-up" data-aos-duration="3000"
            >
              <SneakerHolder sneaker={sneaker} />
            </Link>
           
          ))}
        </Flex>
      ))}
    </Box>
  );
}

export default SneakerRow;
