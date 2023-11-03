const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const user = require('./routes/User');
const provider = require('./routes/provider');
const food = require ('./routes/foods')
const order = require('./routes/order')
const address = require('./routes/address');
const review  = require('./routes/review')

const CronJob = require('cron').CronJob;
const initialData = require('./routes/initialData')
const foodModel = require('./models/food')

const app = express()
const PORT=process.env.PORT || 8000;

env.config();
app.use(cors({
    origin: ['https://tiffin-managment-client.vercel.app','http://localhost:3000'], 
    methods: ['GET', 'PUT', 'POST','DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], 
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

var originsWhitelist = [
    'https://tiffin-managment-client.vercel.app',
    'http://localhost:3000'
 ];
 var corsOptions = {
     origin: function(origin, callback){
         var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
         callback(null, isWhitelisted);
     },
     credentials:true
  }
app.use(cors(corsOptions))

// ,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }

mongoose.connect("mongodb+srv://yrmewara:yrmewara123@cluster0.8ijsljs.mongodb.net/Register?retryWrites=true&w=majority").then(()=>{
    console.log("DataBase Connected")
}).catch((err)=>{
    console.log("not coonected")
    console.log(err.message)
})
const updateFood = async() =>{
    const foods = await foodModel.find()
    for(let i = 0;i<foods.length;i++){
        await foodModel.findByIdAndUpdate(foods[i]._id,{$set:{quantity:foods[i].enteredQuantity}});
    }
}
new CronJob('0 0 * * *', async () => {
    await updateFood()
  }, null, true, 'Asia/Kolkata');

app.get('/',(req,res) =>{
    console.log("Server Is Running")
    }
)
app.use('/api/v1/user', user);
app.use('/api/v1/provider',provider)
app.use('/api/v1/food',food)
app.use('/api/v1/order',order)
app.use('/api/v1/address',address);
app.use('/api/v1/review',review);
app.use('/api/v1/initialData',initialData)

app.listen(PORT,()=>{
    console.log(`Server is Running on port ${PORT}`)
})
