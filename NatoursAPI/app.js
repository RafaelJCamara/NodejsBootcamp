const fs = require('fs');
const express = require('express');
const app = express();

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req,res) => {
    res.status(200).send({
        status: 'success',
        results: tours.length,
        data: tours
    });
});

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}...`);
});