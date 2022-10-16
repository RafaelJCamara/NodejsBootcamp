const fs = require('fs');
const express = require('express');
const { json } = require('express');
const { create } = require('domain');
const app = express();

// allows us to have access to the request's body
// if not present, req.body is undefined
// the .use method allows us to use middleware (add middleware to our middleware stack)
app.use(express.json());

/**
 * We can define our custom middlewares.
 */
app.use((req, res, next) => {
    /**
     * We can add custom properties to the request object and use those in our routers definition (or in another middleware upfront)
     */
    req.requestTime = new Date().toISOString();

    /**
     * We must always call the next method
     * If we don't call it, this will stuck on the middleware pipeline, thus not returning any response to the user
     */
    next();
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/data/tours-simple.json`)
);

const getTours = (req,res) => {
    res.status(200).send({
        status: 'success',
        results: tours.length,
        data: tours
    });
}

const getTourById = (req,res) => {
    const id = req.params.id * 1; //multiplying by one makes the result type of number
    const tour = tours.find(el => el.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: tour
    });
}

const createTour = (req,res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).send({
            status: 'success',
            data: newTour
        });
    });
}

app
    .route("/api/v1/tours")
        .get(getTours)
        .post(createTour);

app
    .route("/api/v1/tours/:id")
        .get(getTourById);

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}...`);
});