// Import express package
const express = require('express');

// Sets express
const app = express();

//set port
const PORT = process.env.PORT || 3000;



// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setup middleware to server static files from /public
app.use(express.static('public'));


require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


//list to connection
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);


