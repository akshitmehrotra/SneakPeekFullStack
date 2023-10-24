import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import Axios from 'axios';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    // fontFamily: 'YourFontFamily', // Uncomment and set this to your custom font family if necessary
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    backgroundColor: '#f3f3f3',
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 12,
    color: 'black',
    // fontFamily: 'YourFontFamily', // Uncomment and set this to your custom font family if necessary
  },
  totalPrice: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'right',
    marginRight: 40,
    fontWeight: 'bold',
  },
});

// Create Document Component for the PDF
const InvoicePDF = ({ useridentification, cartItems, totalPrice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Invoice</Text>
        <Text style={styles.header}>{useridentification}</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Product Name</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Price</Text>
            </View>
          </View>

          {/* Table Rows - Items */}
          {cartItems.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.price}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.totalPrice}>Total Price: {totalPrice}</Text>
      </View>
    </Page>
  </Document>
);

function Razorpay({ cartItems , useridentification }) {
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isPaymentBeingProcessed, setIsPaymentBeingProcessed] = useState(false); // New state

  // Function for handling the payment process
  const paymentHandler = async (e) => {
    e.preventDefault();
    if(useridentification)
    {
    setTimeout(() => {setPaymentStatus('Payment captured successfully');}, 4000);
    setIsPaymentBeingProcessed(true); 
    const API_URL = 'http://localhost:5002/';
    try {
      const orderUrl = `${API_URL}order?totalPrice=${totalPrice}`;
      const response = await Axios.get(orderUrl);
      const { data } = response;

      const rzpOptions = {
        key: 'rzp_test_syWjFUNAtb81VK',
        name: 'SneakPeek',
        description: 'Some Description',
        order_id: data.id,
        handler: async (response) => {
          try {
            const paymentId = response.razorpay_payment_id;
            const captureUrl = `${API_URL}capture/${paymentId}`;
            await Axios.post(captureUrl, {});
            setPaymentStatus('Payment captured successfully');
          } catch (err) {
            console.log(err);
          }
        },
        theme: {
          color: '#686CFD',
        },
      };

      const rzp1 = new window.Razorpay(rzpOptions);
      rzp1.open();
    } catch (err) {
      console.error('Error fetching order:', err);
    
    }
  }
  else
  {
    alert('You have to be logged in first');
  }
  };

  const orderHandler = async (e) => {
    e.preventDefault();
    if(useridentification)
    {
    const username = useridentification;
  const order = {
    cartItems, 
    totalPrice, 
    username, 
  };

  try {
    // Replace with your actual server URL
    const response = await Axios.post('http://localhost:5002/api/orders', order);

    if (response.data.status === 'success') {
      console.log('Order successful!', response.data);
      // Here, you can redirect the user to a 'Success' page, or clear the cart, etc.
    } else {
      console.error('There was an error with the order', response.data.message);
      // Here, you might want to show the user a message about the failure
    }
  } catch (error) {
    console.error('An error occurred while submitting the form', error);
    // Handle the error accordingly
  }
  }
  };

 
  // Function to handle the PDF invoice download
  const downloadInvoice = async () => {
    const invoice = <InvoicePDF cartItems={cartItems} totalPrice={totalPrice} useridentification={useridentification}/>;
    const asPdf = pdf([]); // Creates an empty PDF
    asPdf.updateContainer(invoice);

    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);

    // Create a link element, hide it, direct it towards the blob, and 'click' it programmatically
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.pdf'; // provide the name you want for the downloaded file
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = (e) => {
    paymentHandler(e);
    orderHandler(e);
  };
  // Render the component
  return (
    <Box mt={4} textAlign="center">
      <Box fontSize="xl" fontWeight="bold" mt={2}>
        Payment Page
      </Box>

      {!isPaymentBeingProcessed && (
        <Button colorScheme="green" mt={4} onClick={handleClick}>
          Proceed to Pay ₹{totalPrice}
        </Button>
      )}
      {isPaymentBeingProcessed && paymentStatus === 'Payment captured successfully' && (
        <Button onClick={downloadInvoice} colorScheme="blue" mt={4}>
          Download Invoice
        </Button>
      )}

      <Box mt={2}>{paymentStatus}</Box>
    </Box>
  );
}

export default Razorpay;
