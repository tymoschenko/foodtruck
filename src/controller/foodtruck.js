import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';


export default({ config, db }) => {
  let api = Router();

  /*
   * Food Trucks
   */

  // Add (POST) a new foodtruck
  // '/v1/resturant/add'
  api.post('/add', authenticate, (req, res) => {
    let newFoodTruckt = new FoodTruck();
    newFoodTruckt.name = req.body.name;
    newFoodTruckt.foodtype = req.body.foodtype;
    newFoodTruckt.avgcost = req.body.avgcost;
    newFoodTruckt.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruckt.save(err => {
      if (err) {
        res.send(err);
      } else  {
        res.json({ message: 'FoodTruck saved successfully!'});
      }
    });
  });

  // Read (GET)
  // /v1/foodtruck
  api.get('/', authenticate, (req, res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // /v1/foodtruck/:id
  api.get('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // Update (PUT)
  api.put('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;

      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'FoodTruck information updated successfully!'});
      });
    });
  });

  // Delete (DELETE)
  // /v1/foodtruck/:id
  // TODO: update method to delete any foodtruck related reviews
  api.delete('/:id', (req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'FoodTruck successfully removed.'});
    });
  });

  /*
   * [Food Trucks] Reviews
   */
  // add review for a specific foodtruck id
  // /v1/foodtruck/reviews/add/:id
    api.post('/:id/reviews/add', (req, res) => {
        console.log(`id is ${req.params.id}`);
        FoodTruck.findById(req.params.id, (err, foodtruck) => {
            if (err)
            {
                console.log(`err #1`);
                res.send(err);
            }
            else
            {
                let newReview = new Review();
                newReview.title = req.body.title;
                newReview.text = req.body.text;
                newReview.foodtruck = foodtruck._id;
                newReview.save((err, review) => {
                    if (err)
                    {
                        console.log(`err #2`);
                        res.send(err);
                    }
                    else
                    {
                        foodtruck.reviews.push(newReview);
                        foodtruck.save( err => {
                            if (err)
                            {
                                console.log(`err #3`);
                                res.send(err);
                            }
                            else
                            {
                                res.json({ message: 'FoodTruck review saved successfully.'});
                            }
                        });
                    }
                });
            }
        });
    });

    // get reviews for a specific foodtruck
    // '/v1/foodtruck/:id/reviews'
    api.get('/:id/reviews', (req, res) => {
        Review.find({foodtruck: req.params.id}, (err, reviews) => {
            if (err)
            {
                res.send(err);
            }
            else
            {
                res.json(reviews);
            }
        });
    });



  return api;
}
