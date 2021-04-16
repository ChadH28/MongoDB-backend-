const express = require('express');
const connectDB  = require('./config/db')
// application object using express 
const app = express();

const port = process.env.PORT || 3000

// connect db
connectDB();

// Init middleware
app.use(express.json({
    extended: false
}))

app.get('/', (req, res) =>
 res.send('<h1>welcome and hello<h1> <hr>')
)

// defining routes
app.use('/api/users/', require('./routes/user'));
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/info/', require('./routes/info'));

app.listen(port, () =>{
    console.log(`Listening on port - ${port}`)
});

module.exports = app;