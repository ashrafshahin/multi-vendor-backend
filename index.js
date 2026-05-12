const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express()

mongoose.connect("mongodb+srv://vendorAdmin:Asdf123L@clustershahin.nicn5ni.mongodb.net/ecomvendors?appName=ClusterShahin").then(() => {
    console.log('Database Connected...');
    
})

app.use(express.json())

app.post('/registration', (req, res) => {
    console.log('i am a robot');
    
});

app.listen(5000, () => {
    console.log('Server Running...');
    
})