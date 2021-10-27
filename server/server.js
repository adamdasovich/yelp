require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json())


// Get all restaurants
app.get('/api/v1/restaurants', async (req, res) => {
    try {
        const restaurantRatingsData = await db.query(
            'select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;')
        res.status(200).json({
            status: "success",
            results: restaurantRatingsData.rows.length,
            data: {
                restaurants: restaurantRatingsData.rows,
            },
        })
    } catch (err) {
        console.log(err)
    }

})

// Get a restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await db.query(
            'select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1', [req.params.id])

        const reviews = await db.query(
            'select * from reviews where restaurant_id = $1',
            [req.params.id])

        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            },

        })
    } catch (err) {
        console.log(err)
    }
})

// Create a restaurant
app.post('/api/v1/restaurants', async (req, res) => {
    try {
        const { name, location, price_range } = req.body
        const results = await db.query('INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) RETURNING *', [name, location, price_range])

        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        })
    } catch (err) {
        console.log(err)
    }
})

// Update a restaurant
app.put('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const { name, location, price_range } = req.body;
        const { id } = req.params;
        const results = await db.query('UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING *', [name, location, price_range, id])

        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        })
    } catch (err) {
        console.log(err)
    }

})

// Delete a restaurant 
app.delete('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const { id } = req.params
        const results = await db.query('DELETE FROM restaurants WHERE id = $1', [id])
        res.status(204).json({
            status: "success"
        })
    } catch (err) {
        console.log(err)
    }

})

// Add a review
app.post('/api/v1/restaurants/:id/addReview', async (req, res) => {
    try {
        const { id } = req.params
        const { review, name, rating } = req.body
        const newReview = await db.query('INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) RETURNING *', [id, name, review, rating])
        console.log(newReview)
        res.status(201).json({
            status: 'success',
            data: {
                review: newReview.rows[0]
            }
        })
    } catch (err) {
        console.log(err)
    }
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`The server is listening on port: ${PORT}`)
})