const fs = require('fs');
const express = require('express');
const { json } = require('express');
const app = express();

//allows us to have access to the request's body
//if not present, req.body is undefined
app.use(express.json());

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

app.post("/api/v1/tours", (req,res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).send({
            status: 'success',
            data: newTour
        });
    });
});

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}...`);
});