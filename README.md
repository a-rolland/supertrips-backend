# Supertrips

## Developer:

Antoine Rolland

## Link to App:

[Supertrips](https://supertrips.herokuapp.com/)

## Description

Supertrips is an app that allows to share your trips, and to find inspiration for your future ones. You can create and organize your trips, check your past trips, give your opinion about places you visited. These trips you create can be shared: you can make them public, but you can also keep make them private if you need to edit them for example or if you don't want user users to see it.

## User Stories - MVP

- As a visitor, I want a landing page
- As a visitor, I want a "All trips" page
- As a visitor, I want to be able to make a search through a list of trips
- As a visitor, I want to be able to signup / login / logout (+ validations)

- As a user, I want to create a simple trip (title, duration, etc.) (with title, start-date and end-date validation)
- As a user, I want to have a complete CRUD for trips (CReate, Update, Delete)

## Backlog

List of other features outside of the MVPs scope

- As a visitor, I want to signup/login with social media
- As a visitor, I want to see a nice Brand logo
- As a visitor, I want to see a selection of the most popular trips on the homepage
- As a visitor, I want a responsive app
- As a visitor, I want a footer if I am on a small screen
- As a visitor, I want to see all the places a user visited on a map in the Trip description
- As a visitor, I want the map to adapt its size depending on the scope/span of the experiences
- As a visitor, I want to see the pictures of a Trip in a comfortable way

- As a user, I want to be able to make my trip Public or Private
- As a user, I want to create a simple "step" inside a trip (with title validations)
- As a user, I want a complete CRUD for steps
- As a user, I want to create a simple "experience" inside a trip (with title, date and time validations)
- As a user, I want to have the option to make the date and time of an experience public or private
- As a user, I want a profile with an editable profile picture, access to my own trips, my favorite trips, etc.
- As a user, I want to add trips to my "favorites"
- As a user, I want to locate an experience on a map, and use a service to select an referenced "Place"
- As a user, I want to be able to "Like" a trip.
- As a user, I want to add pictures to my trip.

## Routes - Back-end :

| Method | URL                                         | Description                                                                                                                          |
| ------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
|        | USER                                        |                                                                                                                                      |
| GET    | /api/getUser/:userId                        | takes an id and sends back a json with user infos                                                                                    |
| POST   | /api/signup                                 | takes object with credentials, creates a user and sends back a json with new user infos                                              |
| POST   | /api/login                                  | takes object with credentials, logs a user in and sends back a json with user infos                                                  |
| POST   | /api/auth/facebook                          | takes object with a token, logs a user in and sends back a json with the -new or not- user infos                                     |
| GET    | /api/loggedIn                               | sends back a json with the logged in user infos                                                                                      |
| POST   | /api/logout                                 | logs any logged in user out                                                                                                          |
| PUT    | /api/profile/profilePicture                 | takes an id and an object of filled inputs, updates the user in DB and sends back a json with updated user                           |
| PUT    | /api/toggleAddToFavorites/id                | takes a trip id and adds it to the favorites array of the logged in user in DB, or remove it if it is already there                  |
|        | TRIPS                                       |                                                                                                                                      |
| POST   | /api/newTrip                                | takes an object of filled inputs, creates a new trip in DB and sends back a json with the new trip                                   |
| GET    | /api/trips                                  | sends back a json with a all the trips                                                                                               |
| GET    | /api/popularTrips                           | sends back a json with the 5 top rated trips, ordered by number of 'likes'                                                           |
| GET    | /api/trips/:id                              | takes a trip id and sends back a json with a specific trip                                                                           |
| PUT    | /api/trips/:id                              | takes a trip id and an object of filled inputs, update the trip in DB and sends back a json with the edited trip                     |
| DELETE | /api/trips/:id                              | takes a trip id and delete the found trip in DB                                                                                      |
| PUT    | /api/trip/toggleLikes/:id                   | takes a trip id and add/remove the id of the loggedIn user from the trip's likes array in DB                                         |
| POST   | /api/trip/postComment/:id                   | takes a trip id and an object of filled inputs and adds a comment to the trip's comments array                                       |
|        | STEPS                                       |                                                                                                                                      |
| POST   | /api/newStep                                | takes an object with filled inputs, creates a new step in DB and sends back the new step                                             |
| GET    | /api/steps/:id                              | takes a trip id and sends back a json with the all the steps from a trip                                                             |
| GET    | /api/stepDetails/:id                        | takes a step id and sends back a json with a specific step                                                                           |
| PUT    | /api/steps/:id                              | takes a step id and an object with filled inputs, update the step in DB sends back a json with the edited step                       |
| DELETE | /api/steps/:id                              | takes a step id and delete the found step in DB                                                                                      |
|        | EXPERIENCES                                 |                                                                                                                                      |
| POST   | /api/newExperience                          | takes an object with filled inputs, creates a new experience in DB and sends back a json with the new experience                     |
| GET    | /api/experiences/:stepId                    | takes a step id and sends back a json with all the experiences from this step                                                        |
| GET    | /api/experiences/trip/:id                   | takes a trip id and sends back a json with all the experiences from this trip                                                        |
| GET    | /api/experienceDetails/:id                  | takes an experience id and sends back a json with the found experience                                                               |
| PUT    | /api/experiences/:id                        | takes an experience id and an object of filled inputs, updates the experience in DB and sends back a json with the edited experience |
| DELETE | /api/experiences/:id                        | takes an experience id and delete the found experience in DB                                                                         |
| PUT    | /api/experiences/addPicture/:id             | takes an experience id and an object of filled inputs, edit the experience in DB and sends back a json with the edited experience    |
| DELETE | /api/experiences/:id/deletePicture/:imageId | takes an experience id and an image id, deletes the found image and sends back a json with the edited experience                     |

## Models

User model
('unique' and 'required' validations are made inside user-controller.js, so facebook login can work properly)

- id: ObjectId
- username: String -- REQUIRED
- password: String -- encrypted - REQUIRED
- profile_picture: String -- with default
- favorites: [ObjectId] -- (ref Trips model)
- facebook:
  |- id: String
  |- email: String
  |- name:
  |- firstName: String
  |- lastName: String
- timestamps

Trip model

- id: ObjectId
- title: String -- REQUIRED
- author: ObjectId -- (ref User model)
- isPublic: Boolean -- default: false
- startDate: String -- REQUIRED
- endDate: String -- REQUIRED
- duration: Number
- imageUrl: String -- with default
- likes: [ObjectId] = user.\_id
- comments: [
  - commentAuthor:
    |- \_id: ObjectId
    |- username: String
    |- profilePicture: String
  - comment: String
    ]
- timestamps

Step model

- id: ObjectId
- title: String -- REQUIRED
- trip: ObjectId - (ref Trip model)
- timestamps

Experience model

- id: ObjectId
- title: String -- REQUIRED
- step: ObjectId - (ref Step model)
- trip: ObjectId - (ref Trip model)
- description: String
- place:
  |- address: String
  |- lat: Number
  |- lng: Number
- date: String -- REQUIRED
- time: String -- REQUIRED
- showDate: Boolean -- default: false
- showTime: Boolean -- default: false
- pictures: [
  - id: ObjectId
  - url: String
    ]
- timestamps

Sessions model (automatically created)

- id: ObjectId
- expires: Date
- session: Object

## Links

### Project Kanban

[Trello](https://trello.com/b/13f2FoyZ/supertrips)

### Git repository

[Frontend](https://github.com/a-rolland/supertrips-frontend)
[Backend](https://github.com/a-rolland/supertrips-backend)

### Deploy on Heroku

[Supertrips](https://supertrips.herokuapp.com/)

### Slides

[Presentation slides](https://docs.google.com/presentation/d/1YC5Bo_ZHCLL2DVZpUL5g2bi6fhK_iwcE3fFI6c4JplQ/edit?usp=sharing)
