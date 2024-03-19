const express = require('express');
const mysql = require('mysql');

const app = express();

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_crud_demo'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Retrieve all records
app.get('/records', (req, res) => {
    connection.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error retrieving records: ', err);
            res.status(500).send('Error retrieving records');
            return;
        }
        res.send(results);
    });
});

// Retrieve a specific record
app.get('/records/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM students WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error('Error retrieving record: ', err);
            res.status(500).send('Error retrieving record');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Record not found');
            return;
        }
        res.send(results[0]);
    });
});

// Create a new record
app.post('/records', (req, res) => {
    const { name, age } = req.body;
    connection.query('INSERT INTO students SET ?', { name, age }, (err, result) => {
        if (err) {
            console.error('Error creating record: ', err);
            res.status(500).send('Error creating record');
            return;
        }
        res.status(201).send('Record created successfully');
    });
});

// Update an existing record
app.put('/records/:id', (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;
    connection.query('UPDATE students SET name = ?, age = ? WHERE id = ?', [name, age, id], (err, result) => {
        if (err) {
            console.error('Error updating record: ', err);
            res.status(500).send('Error updating record');
            return;
        }
        res.send('Record updated successfully');
    });
});

// Delete a record
app.delete('/records/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM students WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error('Error deleting record: ', err);
            res.status(500).send('Error deleting record');
            return;
        }
        res.send('Record deleted successfully');
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
