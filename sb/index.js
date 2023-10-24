const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const razorpay = require('razorpay');
const app = express();
const PORT = process.env.PORT || 5002;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'sneaker_db',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(cors());

app.get('/api/sneakers', (req, res) => {
  connection.query('SELECT * FROM sneakers', (err, results) => {
    if (err) {
      console.error('Error fetching sneakers:', err);
      res.status(500).json({ error: 'Error fetching sneakers' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/sneakers', (req, res) => {
  const { name, price, brand, image_link, description } = req.body;
  if (!name || !price || !brand || !image_link || description === undefined) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const newSneaker = { name, price, brand, image_link, description };
  connection.query('INSERT INTO sneakers SET ?', newSneaker, (err, result) => {
    if (err) {
      console.error('Error adding a sneaker:', err);
      res.status(500).json({ error: 'Error adding a sneaker' });
      return;
    }
    res.json({ message: 'Sneaker added successfully', id: result.insertId });
  });
});

app.put('/api/sneakers/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, brand, image_link, description } = req.body;

  if (!name || !price || !brand || !image_link || description === undefined) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const updatedSneaker = { name, price, brand, image_link, description };
  connection.query(
    'UPDATE sneakers SET ? WHERE id = ?',
    [updatedSneaker, id],
    (err, result) => {
      if (err) {
        console.error('Error updating the sneaker:', err);
        res.status(500).json({ error: 'Error updating the sneaker' });
        return;
      }
      res.json({ message: 'Sneaker updated successfully', id: result.insertId });
    }
  );
});

app.delete('/api/sneakers/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM sneakers WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error deleting the sneaker:', err);
      res.status(500).json({ error: 'Error deleting the sneaker' });
      return;
    }
    res.json({ message: 'Sneaker deleted successfully', id });
  });
});

app.get('/api/sneakers/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    // Query your database to retrieve the sneaker details by ID
    // Replace the following example with your actual database query
    connection.query('SELECT * FROM sneakers WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error fetching sneaker details:', err);
        res.status(500).json({ error: 'Error fetching sneaker details' });
        return;
      }
  
      if (result.length === 0) {
        // If no sneaker with the given ID is found, return a 404 response
        res.status(404).json({ error: 'Sneaker not found' });
        return;
      }
  
      // Return the sneaker details in the response
      res.json(result[0]);
    });
  });
  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert the user into the database
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
      if (error) {
        console.error('Error registering user: ', error);
        res.status(500).json({ error: 'Error registering user' });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
  });
  
  // Login endpoint
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the user exists
    connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
      if (error) {
        console.error('Error logging in: ', error);
        res.status(500).json({ error: 'Error logging in' });
      } else if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        const user = results[0];
  
        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          // Create a JWT token
          const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
  
          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
      }
    });
  });
  
  // Admin route
  app.get('/api/user/:username/isAdmin', (req, res) => {
    const userId = req.params.userId;
  
    // Query the database to get the isAdmin status for the user
    connection.query('SELECT admin FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error fetching isAdmin status:', err);
        return res.status(500).json({ error: 'Error fetching isAdmin status' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Return the isAdmin status in the response
      const isAdmin = results[0].admin;
      res.json({ isAdmin });
    });
  });

  //RazorPay
  const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: "rzp_test_syWjFUNAtb81VK",
    key_secret: "DOcg8CyYB2tAx6VJqIpcut32",
});
app.get("/order", (req, res) => {
    try {
      const { totalPrice } = req.query; // Get the totalPrice from the query parameters
  
      if (!totalPrice || isNaN(totalPrice)) {
        return res.status(400).json({
          message: "Invalid totalPrice provided",
        });
      }
  
      const options = {
        amount: totalPrice * 100, // Convert the totalPrice to paisa
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 1, // 1 for automatic capture // 0 for manual capture
      };
  
      instance.orders.create(options, async function (err, order) {
        if (err) {
          return res.status(500).json({
            message: "Something Went Wrong",
          });
        }
  
        return res.status(200).json(order);
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  });
  
  
  app.post('/capture/:paymentId', (req, res) => {
//   try {
//     const { totalPrice, cartItems, userId } = req.body; // Get data from the request body

//     if (!totalPrice || isNaN(totalPrice) || !cartItems || !userId) {
//       return res.status(400).json({
//         message: 'Invalid data provided',
//       });
//     }

//     const paymentId = req.params.paymentId; // Get payment ID from URL parameter

//     // Construct SQL query to insert order details into the database
//     const insertOrderQuery = `
//       INSERT INTO orders (payment_id, cart_items, total_price, user_id)
//       VALUES (?, ?, ?, ?)
//     `;

//     connection.query(
//       insertOrderQuery,
//       [paymentId, JSON.stringify(cartItems), totalPrice, userId],
//       (err, results) => {
//         if (err) {
//           console.error('Error inserting order into the database:', err);
//           return res.status(500).json({
//             message: 'Something Went Wrong',
//           });
//         }

//         console.log('Order inserted into the database');
//         return res.status(200).json({
//           message: 'Order captured and stored successfully',
//         });
//       }
//     );
//   } catch (err) {
//     console.error('Error capturing payment:', err);
//     return res.status(500).json({
//       message: 'Something Went Wrong',
//     });
//   }
app.post('/capture/:paymentId', (req, res) => {
    const { totalPrice, cartItems, userId } = req.body;
    if (!name || !price || !brand || !image_link || description === undefined) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
  
    const newSneaker = { name, price, brand, image_link, description };
    connection.query('INSERT INTO sneakers SET ?', newSneaker, (err, result) => {
      if (err) {
        console.error('Error adding a sneaker:', err);
        res.status(500).json({ error: 'Error adding a sneaker' });
        return;
      }
      res.json({ message: 'Sneaker added successfully', id: result.insertId });
    });
  });
});

app.post('/api/orders', (req, res) => {
  const { cartItems, totalPrice, username } = req.body;

  if (!cartItems || !totalPrice || !username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const insertOrderQuery = 'INSERT INTO orders (cart_items, total_price, username) VALUES (?, ?, ?)';

  connection.query(
    insertOrderQuery,
    [JSON.stringify(cartItems), totalPrice, username],
    (err, result) => {
      if (err) {
        console.error('Error inserting order into the database:', err);
        return res.status(500).json({
          message: 'Error inserting order into the database',
        });
      }
      else
      console.log('Hello');
      return res.status(200).json({
        message: 'Order inserted successfully',
      });
    }
  );
});

app.get('/api/orders/:username', (req, res) => {
  const username = req.params.username;

  // Protect against SQL injection by using prepared statements
  connection.query('SELECT * FROM orders WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
