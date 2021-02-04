# Capstone: Restaurant Reservation System

> You have been hired as a fullstack developer at _Periodic Tables_, a startup that is creating reservation systems for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> At this point, the customers will not access the system online.

There are no user stories for deployment, it is expected that you will deploy the application to production after you finish a user story.

## Existing files

As you work through the Node.js, Express & PostgreSQL module, you will be writing code that allows your frontend and backend code to talk to eachother. It will also allow your controllers and services to connect to and query your PostgreSQL database via [Knex](http://knexjs.org/). The table below describes the files and folders in the starter code:

| Folder/file path | Description                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `back-end`       | Directs requests to the appropriate routers.                                     |
| `front-end`      | Starts the server on `localhost:5000` by default.                                |
| `src/db/`        | A folder where you will add migration and seed files for your database later on. |
| `src/errors/`    | A folder where you will find several functions for handle various errors         |
| `.env.sample`    | A sample environment configuration file                                          |

This starter code closely follows the best practices and patterns established in the Robust Server Structure module.

## Database setup

1. Set up four new ElephantSQL database instance - development, test, preview, and production - by following the instructions in the "PostgreSQL: Creating & Deleting Databases" checkpoint.
1. After setting up your database instances, connect DBeaver to your new database instances by following the instructions in the "PostgreSQL: Installing DBeaver" checkpoint.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with a connection URL to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

If you have trouble getting the server to run, reach out for assistance.

## Running tests

This project has unit, integration, and end-to-end (e2e) tests. You have seen unit and integration tests in previous projects.
End-to-end tests use browser automation to interact with the application just like the user does.
Once the tests are passing for a given user story, you know you have the necessary functionality.

1. Run `npm test` to run all tests - unit, integration, and end-to-end.
1. Run `npm run test:back-end` to run unit, integration, and end-to-end tests for the backend.
1. Run `npm run test:front-end` to run unit, integration, and end-to-end tests for the frontend.
1. Run `npm run test:e2e` to run only the end-to-end tests for the frontend.

> **Note**: After running `npm test` or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

### Screenshots

To help you better understand what might be happening during the end-to-end tests, screenshots are taken at various points in the test.
The screenshots are saved in `front-end/.screenshots` and you can review them after running the end-to-end tests.

You can use the screenshots to debug your code by rendering additional information on the screen.

## Product Backlog

The tests exist for each of these user stories. The tests are organized by user story so that you know exactly which tests
you need to make pass for the user story you are currently implementing.

There are no user stories for deployment. You are encouraged to deploy early and often. You may even decide to deploy
before adding any features. Since this is a monorepo, you can follow the instructions in [this vercel article on monorepos](https://vercel.com/blog/monorepos) to deploy this project.

### US-1 Create and list reservations

As a restaurant manager
I want to create a new reservation
so that I know how many customers will arrive at the restaurant on a given day.

#### Acceptance Criteria

1. The `/reservations/new` page will
   - have the following required and not-nullable fields.
     - First name: `<input name="first_name" />`
     - Last name: `<input name="last_name" />`
     - Mobile number: `<input name="mobile_number" />`
     - Date of reservation: `<input name="reservation_date" />`
     - Time of reservation: `<input name="reservation_time" />`
     - Number of people in the party, which must be at least 1 person. `<input name="people" />`
   - display a `Submit` button that, when clicked, saves the new reservation then displays the `/dashboard` page for the date of the new reservation
   - display a `Cancel` button that , when clicked, returns the user to the previous page.
1. The `/dasboard` page will
   - list all reservations for a one date (e.g. GET `/reservations?date=2020-12-30`), the date is defaulted to today, and the reservations are sorted by time
   - Display next, previous, and today buttons that allow the user to see reservations on other dates

> **Hint** Dates and times are JavaScript and databases can be challenging.
> The users have confirmed that they will be using Chrome to access the site.
>
> This means you can use `<input type="date" />` and `<input type="time" />`, which are supported by Chrome but may not work in some other browsers.
>
> `<input type="date" />` will store the date in `YYYY-MM-DD` format, this is a format that works well with the PostgreSQL `date` data type.
> `<input type="time" />` will store the date in `HH:MM:SS` format, and this is a format that works well with the PostgreSQL `time` data type.
>
> You do no need to worry about different or changing time zones for the dates or times.

### US-2 TBD
