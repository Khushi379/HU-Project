const express = require('express');
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./config/db');
connectToDB();

const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', userRouter);



app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on port 3000`);
});