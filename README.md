# Facehack

## Description
A jobs platform from Ironhackers to Ironhackers.
 
## User Stories
 - **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
 - **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
 - **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
 - **sign up** - As a user I want to sign up on the webpage so that I can see all the jobs
 - **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
 - **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
 - **job create** - As a user I want to create a job offer opportunity so that other users can apply
 - **job list** - As a user I want to see all the jobs available so that I can choose which ones I want to apply
 - **job detail** - As a user I want to see more information regarding one job so that I can decide if I want to apply 
 - **job request application** - As a user I recieve other user applications to my job offer so that I can decide if I accept or decline 
 - **my profile** - As a user I want to see my profile so that I created before
 - **others profile** - As a user I want to see the others profiles so that they had created
 - **edit profile** - As a user I want to edit my profile so that I can edit actual data and add more like name, date of birth, short bio, etc

## Backlog

List of other features outside of the MVPs scope

User profile:
- upload my profile picture
- user finder
- list of jobs offer created by the user
- list jobs offer the user have applied

Job:
- Edit a job offer

Job sorting:
- Sort by type: Webdev/UX-UI
- Sort by salary
- Sort by full-time or part-time

Job Location:
- add geolocation to job offer when creating
- show job offer in a map in job detail page
 
Chat:
- create a new view for the main channel
- using socket.io we detect when a user is connected to the channel
- user is able to chat on the channel
- list of connected users on sidebar

## Routes
```
GET / 

GET /auth/signup
POST auth/signup - POST Body: email, password
GET /auth/login
POST /auth/login - POST Body: email, password
POST auth/logout - POST Body: nothing

GET /jobs
GET /jobs/create
POST /jobs/create - POST Body: title, company, type, salary,journey-type, description, vacancies, location
GET /jobs/:id
POST /jobs/:id/application - POST Body: nothing (the user is already stored in the session)
GET /jobs/:id/applicants

GET /profile
GET /profile/edit
POST /profile/edit - POST Body: name, lastname, email, date-of-birth, phone, RRSS, short-bio
GET /profile/:id

```

## Models

``` javascript
const jobSchema = new Schema({
    title: String,
    company: String,
    type: String,
    description: String,
    salary: Number,
    journeyType: String,
    vacancies: Number,
    location: {type: {type: String}, coordinates: [Number]},
    applicants: ObjectId
});
```    
 
``` javascript
const userSchema = new Schema({
    name: String,
    lastName: String,
    email: {type: String, unique: true}
    password: String,
    dateOfBirth: Date,
    phone: String,
    bio: String,
    socialNetworks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        github: String
    }
});
```

## Links

### Trello

[Trello board!!](https://trello.com/b/P8GD72n6/facehack)

### Git

The url to your repository and to your deployed project

[Repository Link!!](https://github.com/nixiescream/face-hack)

[Deploy Link](http://heroku.com)

### Slides.com

The url to your presentation slides

[Slides Link](http://slides.com)
