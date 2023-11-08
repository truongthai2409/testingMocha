const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Thay thế bằng tên người dùng MySQL của bạn
  password: '', // Thay thế bằng mật khẩu MySQL của bạn
  database: 'myapp' // Thay thế bằng tên cơ sở dữ liệu MySQL của bạn
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [username], async (error, results) => {
      if (error) {
        throw error;
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(insertQuery, [username, hashedPassword], (error) => {
        if (error) {
          throw error;
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const selectQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(selectQuery, [username], async (error, results) => {
      if (error) {
        throw error;
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      res.status(200).json({ message: 'Authentication successful' });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;