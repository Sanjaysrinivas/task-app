const mysql = require('mysql');

// Create a connection to the Azure MySQL database
const connection = mysql.createConnection({
  host: 'first-server.mysql.database.azure.com',
  user: 'taskadmin',
  password: 'Password123',
  database: 'task',
  port: 3306, // Replace with the appropriate port if necessary
  ssl: true // Enable SSL if required for your Azure MySQL database
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database!');
  }
});

// Define your API endpoint
module.exports = async function (context, req) {
  if (req.method === 'POST') {
    const { Name, Surname, Message } = req.body;

    // Insert the data into the database
    connection.query(
        'INSERT INTO person (ID, Name, Surname, Message) VALUES (DEFAULT, ?, ?, ?)'
      [Name, Surname, Message],
      (error, results) => {
        if (error) {
          console.error('Error executing the INSERT query:', error);
          context.res.status(500).json({ error: 'Internal Server Error' });
        } else {
          context.res.json({ message: 'Data inserted successfully!' });
        }
      }
    );
  } else if (req.method === 'GET') {
    // Retrieve data from the database
    connection.query('SELECT * FROM person', (error, results) => {
      if (error) {
        console.error('Error executing the SELECT query:', error);
        context.res.status(500).json({ error: 'Internal Server Error' });
      } else {
        context.res.json(results);
      }
    });
  } else {
    context.res.status(400).json({ error: 'Invalid request' });
  }
};

// Close the database connection when the API is done executing queries
process.on('exit', () => {
  connection.end();
});
