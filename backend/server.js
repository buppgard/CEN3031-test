const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5001;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test_db',
  password: 'password',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/add-name', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO names (name) VALUES ($1)', [name]);
    res.status(200).send('Name added');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM names');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
