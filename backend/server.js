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

app.delete('/delete-oldest', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM names WHERE id = (SELECT id FROM names ORDER BY id ASC LIMIT 1) RETURNING *'
    );
    if (result.rows.length === 0) {
      res.status(404).send('No items to delete');
    } else {
      res.status(200).send('Oldest item deleted');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send(err.toString());
  }
});
