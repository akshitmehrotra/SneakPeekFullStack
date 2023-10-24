// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // function Orders({username}) {
// //   // State to keep track of the orders
// //   const [orders, setOrders] = useState([]);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     // Function to fetch data from your API
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:5002/api/orders/${username}`);
// //         setOrders(response.data);  // Set the orders in state
// //       } catch (error) {
// //         setError(error);
// //       }
// //     };

// //     fetchData();
// //   }, [username]); 
// //   const getProductNamesFromOrder = (order) => {
// //     // Parse the cart_items JSON to a JavaScript object/array
// //     const cartItems = JSON.parse(order.cart_items);

// //     // Map through the items and get each product name
// //     const productNames = cartItems.map(item => item.name);

// //     return productNames;
// //   };
// //   // Render your component based on the state
// //   if (error) {
// //     return <div>Error: {error.message}</div>;
// //   } else {
// //     return (
// //       <div>
// //         <h1>Orders:</h1>
// //         {orders.length > 0 ? (
// //           <ul>
// //             {orders.map((order, index) => (
// //               <li key={index}>
// //                 {/* Render order details here. For example: */}
// //                 Order ID: {order.id}
// //                 <ul>
// //             {getProductNamesFromOrder(order).map((name, i) => (
// //               <li key={i}>{name}</li>
// //             ))}
// //           </ul>
// //               </li>
// //             ))}
// //           </ul>
// //         ) : (
// //           <p>No orders found for user.</p>
// //         )}
// //       </div>
// //     );
// //   }
// // }

// // export default Orders;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Orders({ username }) {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5002/api/orders/${username}`);
//         setOrders(response.data);
//       } catch (error) {
//         setError(error);
//       }
//     };

//     fetchData();
//   }, [username]);

//   const getProductsFromOrder = (order) => {
//     // Assuming cart_items is a JSON string of products
//     const cartItems = JSON.parse(order.cart_items);
//     return cartItems; // this will be an array of product objects
//   };

//   // Styles
//   const styles = {
//     container: {
//       maxWidth: '600px',
//       margin: '0 auto',
//       padding: '20px',
//       border: '1px solid #ddd',
//       borderRadius: '5px',
//       fontFamily: 'Arial, sans-serif',
//     },
//     orderItem: {
//       background: '#f9f9f9',
//       padding: '10px',
//       borderRadius: '5px',
//       margin: '10px 0',
//     },
//     productImage: {
//       maxWidth: '100px', // or another size you prefer
//       maxHeight: '100px',
//     },
//     // ... other styles
//   };

//   return (
//     <div style={styles.container}>
//       <h1>Orders:</h1>
//       {error ? (
//         <div style={styles.error}>Error: {error.message}</div>
//       ) : orders.length > 0 ? (
//         <ul style={styles.list}>
//           {orders.map((order, index) => (
//             <ul key={index} style={styles.orderItem}>
//               <p><strong>Order ID:</strong> {order.id}</p>
//               <ul style={styles.list}>
//                 {getProductsFromOrder(order).map((product, i) => (
//                   <ul key={i} style={styles.listItem}>
//                     <img src={product.image_link} alt={product.name} style={styles.productImage} />
//                     <span>{product.name}</span> 
//                   </ul>
//                 ))}
//               </ul>
//             </ul>
//           ))}
//         </ul>
//       ) : (
//         <p>No orders found for user.</p>
//       )}
//     </div>
//   );
// }

// export default Orders;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text, Flex, VStack, HStack, Image, Center } from '@chakra-ui/react';

function Orders({ username }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/orders/${username}`);
        setOrders(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [username]);

  const getProductsFromOrder = (order) => {
    // Assuming cart_items is a JSON string of products
    return JSON.parse(order.cart_items);
  };
  
  const formatDate = (timestamp) => {
    // Create a date object from timestamp
    const date = new Date(timestamp);
  
    // Format the date and time
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based in JavaScript
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    // const seconds = ("0" + date.getSeconds()).slice(-2); // optional, for displaying seconds
  
    // return as formatted string
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
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
        Your Orders
      </Text>
      {error ? (
        <Text mt={4}>{error.message}</Text>
      ) : orders.length > 0 ? (
        orders.map((order, index) => (
          <VStack key={index} mb={2} 
          borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  p={4}
                  m={4}
                  bg="#fef6e7"
                  boxShadow="md"
                  justifyContent={"start"}
                  spacing={4}
            >
            <Text fontSize="xl" fontWeight="bold" >
              Order ID: {order.id}
            </Text>
            <Text fontSize="md" >
            Date: {formatDate(order.createdAt)}
            </Text>
            <Text fontSize="sm" >
            Total Amount: ₹{order.total_price}
            </Text>
            {getProductsFromOrder(order).map((product, i) => (
              <Flex key={i} alignContent={"center"} justifyContent={'space-evenly'}>
                <Flex
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  p={4}
                  m={4}
                  bg="#F7F7F7"
                  boxShadow="md"
                  justifyContent={"start"}
                  spacing={4}
                  width={"40vw"}
                >
                  <Image
                    boxSize="100px"
                    objectFit="contain"
                    src={product.image_link}
                    alt={product.name}
                    width={"10vw"}
                  />
                  <Flex width={"50vw"} flexDirection={"column"}>
                    <Text align={"start"} fontSize="lg" fontWeight="bold" color="#000">
                      {product.name}
                    </Text>
                    <Text align={"start"} fontSize="md" color="#000">
                      {product.brand}
                    </Text>
                    <Text align={"start"} fontSize="sm" color="#000">
                     ₹{product.price}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ))}
          </VStack>
        ))
      ) : (
        <Text mt={4}>No orders found.</Text>
      )}
    </Box>
  );
}

export default Orders;
