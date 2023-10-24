import React, { useState,useEffect } from 'react';
import { ChakraProvider, Box, CSSReset, Container } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Sneaker from './pages/Sneaker';
import Cart from './pages/Cart';
import Razorpay from './payment/Razorpay';
import OrderConfirmation from './pages/OrderConfirmation';
import NavBar from './components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { extendTheme } from "@chakra-ui/react";

// Extend the default theme
const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      "html, body": {
        backgroundColor: "#fef6e7",  // your desired background color
        color: "black",  // optional: default text color
        height: "100%",  // ensures full height taken
        width: "100%"  // ensures full width taken
      },
      "#root": {
        height: "100%"  // if your app is mounted on a div with id 'root', ensure it takes full height
      }
    }
  }
});

function App() {
  const [cart, setCart] = useState([]); // Manage cart state
  const [useridentification, setUseridentification] = useState('');
  // Function to add items to the cart
  const addToCart = (item) => {
    console.log('Added to Cart1:', item.name);
    const updatedDataObject = [...cart, item];
    setCart(updatedDataObject);
  };

  const updateUser = (item) => {
    console.log('ind', item);
    setUseridentification(item);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    console.log('removed:', itemId);
  };
  console.log('Cart:', cart);

  useEffect(() => {
    AOS.init({
      // once: true, // whether animation should happen only once - while scrolling down
      // mirror: false, // whether elements should animate out while scrolling past them
      // duration: 600, // values from 0 to 3000, with step 50ms
    });
  }, []);
  const [searchTerm, setSearchTerm] = useState(''); // State is lifted up here

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
      <Box bgColor={"#fef6e7"}>
        <NavBar setUseridentification={setUseridentification} setSearchTerm={setSearchTerm} updateUser={updateUser}/>
            <Routes>
              <Route path="/" element={<Home searchTerm={searchTerm}/>} />
              <Route path="admin" element={<Admin />} />
              <Route path="/sneakers/:id" element={<Sneaker cart={cart} addToCart={addToCart} useridentification={useridentification}/>} />
              <Route path="/cart" element={<Cart cartItems={cart} removeFromCart={removeFromCart}/>} />
              <Route path="/pay" element={<Razorpay cartItems={cart} useridentification={useridentification}/>} />
              <Route path="/order" element={<OrderConfirmation username={useridentification}/>} />
            </Routes>
      </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
