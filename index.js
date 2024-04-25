const express = require('express'); 
const cors = require('cors');
const port = process.env.PORT || 3000

const app = express()

// jsfjlsjf
app.use(express.json())
app.use(cors())


app.get("/", (req, res)=>{
    res.send("data will coming soon")
})
app.listen(port, ()=>{
    console.log(`This server is running on port:${port}`);
})