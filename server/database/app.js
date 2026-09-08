const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});


const Reviews = require('./review');

const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
  
} catch (error) {
  res.status(500).json({ error: 'Error fetching documents' });
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealerships = await Dealerships.find();
    res.status(200).json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Express route to fetch Dealers by a particular state
// app.get('/fetchDealers/:state', async (req, res) => {
//   try {
//     const stateName = req.params.state;
//     // Find dealerships matching the state parameter
//     const dealerships = await Dealerships.find({ state: stateName });
//     res.status(200).json(dealerships);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching dealerships by state' });
//   }
// });

// Express route to fetch dealer by a particular id
// app.get('/fetchDealer/:id', async (req, res) => {
//   try {
//     const dealerId = parseInt(req.params.id);
//     // Find dealership matching the ID
//     const dealership = await Dealerships.find({ id: dealerId });
//     res.status(200).json(dealership);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching dealer by id' });
//   }
// });

// Express route to get all reviews
// app.get('/fetchReviews', async (req, res) => {
//   try {
//     const reviews = await Reviews.find();
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching reviews' });
//   }
// });

// Express route to get reviews by dealer id
// app.get('/fetchReviews/dealer/:id', async (req, res) => {
//   try {
//     const dealerId = parseInt(req.params.id);
//     // Find reviews where the dealership ID matches
//     const reviews = await Reviews.find({ dealership: dealerId });
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching reviews for dealer' });
//   }
// });

// Express route to insert a new review
// app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
//   data = JSON.parse(req.body);
//   // Find the highest current ID so we can increment it for the new review
//   const documents = await Reviews.find().sort( { id: -1 } );
//   let new_id = documents[0] ? documents[0]['id'] + 1 : 1;

//   const review = new Reviews({
//     "id": new_id,
//     "name": data['name'],
//     "dealership": data['dealership'],
//     "review": data['review'],
//     "purchase": data['purchase'],
//     "purchase_date": data['purchase_date'],
//     "car_make": data['car_make'],
//     "car_model": data['car_model'],
//     "car_year": data['car_year'],
//   });

//   try {
//     const savedReview = await review.save();
//     res.json(savedReview);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Error inserting review' });
//   }
// });


app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});