const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app =express()
var cors= require('cors');
const route = require("./Routes/router.js");
//

app.use(morgan('dev'));
app.use(express.json());

app.use(cors());
app.use("/" , route);

// DATABASE CONNECTION

mongoose.connect('mongodb+srv://Neeraja:Hiclousia@123@cluster0.koj69cg.mongodb.net/?retryWrites=true&w=majority',
    
{ useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false

})
.then(() => {console.log("MongoDB Is Connected To Hiclousia")})
.catch((err )=> console.log(err));

// PORT
const port = process.env.PORT || 8000  ;

app.listen(port,()=>{
    console.log(`server running On port ${port}`)

}  
);