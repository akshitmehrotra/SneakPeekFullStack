import React from 'react'
import Navbar from '../components/Navbar'
import { Box, Image, Button, Flex } from '@chakra-ui/react'
import SneakerRow from '../components/SneakerRow'
const Home = ({searchTerm}) => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div bgColor={"#fef6e7"} >
      <Flex width={"100%"}  bgImage={"https://i.imgur.com/WPoQ8Kb.jpg"}
      bgPosition={"center"}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      height={"100vh"} 
      alignItems={"center"}
      justifyContent={"center"}>
        <Button padding={"1.5vw"} marginTop={"30vh"} marginRight={"4.5vw"} bgColor={'#1A272E'} color={"white"} variant='solid' borderRadius={"15px"} onClick={() => scrollToSection('SneakerRow')}>
    Explore Now
  </Button>
      </Flex>
      <div id='SneakerRow' height="0" width="0"></div>
    <SneakerRow searchTerm={searchTerm}/>
    </div>
  )
}

export default Home