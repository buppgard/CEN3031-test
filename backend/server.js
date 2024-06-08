const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/add-name', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO names (name) VALUES ($1)', [name]);
    res.status(200).send('Name added');
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send(err.toString());
  }
});

app.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM names');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send(err.toString());
  }
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

// ChatGPT Endpoint
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Replace with your OpenAI API key
        },
      }
    );
    console.log('ChatGPT API response:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching from ChatGPT API', error);
    res.status(500).send('Error fetching from ChatGPT API');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
