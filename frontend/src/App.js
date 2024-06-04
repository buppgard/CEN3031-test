import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      const response = await axios.get('http://localhost:5001/names');
      setNames(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/add-name', { name });
      setName('');
      fetchNames();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>CEN3031 Test</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Please enter a name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {names.map((name) => (
            <tr key={name.id}>
              <td>{name.id}</td>
              <td>{name.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
