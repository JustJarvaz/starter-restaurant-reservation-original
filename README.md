# Capstone: Restaurant Reservation System

> You have been hired as a fullstack developer at _Periodic Tables_, a startup that is creating reservation systems for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> At this point, the customers will not access the system online.

There are no user stories for deployment, it is expected that you will deploy the application to production after you finish a user story.

## Existing files

As you work through the Node.js, Express & PostgreSQL module, you will be writing code that allows your frontend and backend code to talk to eachother. It will also allow your controllers and services to connect to and query your PostgreSQL database via [Knex](http://knexjs.org/). The table below describes the files and folders in the starter code:

| Folder/file path | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `back-end`       | The backend project, which runs on `localhost:5000` by default.  |
| `front-end`      | The frontend project, which runs on `localhost:3000` by default. |

This starter code closely follows the best practices and patterns established in the Robust Server Structure module.

## Database setup

1. Set up four new ElephantSQL database instance - development, test, preview, and production - by following the instructions in the "PostgreSQL: Creating & Deleting Databases" checkpoint.
1. After setting up your database instances, connect DBeaver to your new database instances by following the instructions in the "PostgreSQL: Installing DBeaver" checkpoint.

### Knex

Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located.

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
1. Run `npm run test:back-end` to run unit, integration, and end-to-end tests for the backend. The logging level for the backend is set to `warn` when running tests and `info` otherwise.
1. Run `npm run test:front-end` to run unit, integration, and end-to-end tests for the frontend.
1. Run `npm run test:e2e` to run only the end-to-end tests for the frontend.

> **Note**: After running `npm test` or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

### Screenshots

To help you better understand what might be happening during the end-to-end tests, screenshots are taken at various points in the test.
The screenshots are saved in `front-end/.screenshots` and you can review them after running the end-to-end tests.

You can use the screenshots to debug your code by rendering additional information on the screen.

## Product Backlog

The tests exist for each of these user stories. The tests are organized by user story so that you know exactly which tests you need to make pass for the user story you are currently implementing.

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

### US-2 Create reservation on a future, working date

As a restaurant manager
I want to allow my customers to make a reservation on a future, working date only

#### Acceptance criteria

Given that the restaurant manager is on the `/reservations/new` page,
When the restaurant manager submits a reservation form,
Display an error message, with `className="alert alert-danger"`, if any of the following constraints are violated:

- The date and time of the reservation must occur some time in the future, on a day the restaurant is open for service (the restaurant is closed on Tuesdays).

### US-3 Create reservation within eligible timeframe

As a restaurant manager
I want to allow my customers to make a reservation within an eligible timeframe only

#### Acceptance criteria

Given that the restaurant manager is on the `/reservations/new` page,
When the restaurant manager submits a reservation form,
Display an error message, with `className="alert alert-danger"`, if the following constraints are violated:

- The reservation can only be made during normal business hours, between **10:30AM** and **10:30PM**,
- The latest reservation time must _not_ occur within 60 minutes of the close time, so any reservation made between **10:30AM** (inclusive) and **9:30PM** (inclusive) will be honored.

### US-4 Seat reservation

As a restaurant manager
I want to seat a reservation at a specific table
so that I know how many occupied and free tables I have in the restaurant.

#### Acceptance Criteria

1. The `/tables/new` page will
   - have the following required and not-nullable fields.
     - Table name: `<input name="table_name" />`, which must be at least 2 characters long.
     - Capacity: the number of people that can be seated at the table, which must be at least 1 person. `<input name="capacity" />`
   - display a `Submit` button that, when clicked, saves the new table then displays the `/tables` page
   - display a `Cancel` button that , when clicked, returns the user to the previous page
1. The `/dasboard` page will
   - display a list of all reservations in one area.
   - display a list all tables for the restaurant sorted by `table_name` in another area.
     - Each table will display "Free" or "Occupied" depending on whether a group is seated at the table.
   - The "Free" or "Occupied" text must have a `data-table-id-status=${table.table_id}` attribute, so it can be found by the tests.
   - The areas for displaying reservations and table can be arranged any way you like; left and right or top and bottom, etc.
   - Display a "Seat" button on each reservation.
   - "Seat" button must be a link with an `href` attribute that equals `/reservations/${reservation_id}/seat`, so it can be found by the tests.
   - the "Seat" button will be disabled or hidden if the reservation is already assigned to a table.
   - Reservations may be seated at any time; before or after the actual reservation time.
1. The `/reservations/:reservation_id/seat` page will
   - have the following required and not-nullable fields.
     - Table number: `<select name="table_id" />` listing only the unoccupied tables.
     - The text of the option should be `{table.table_name} - {table.capacity}`
   - have the following validations:
     - Do not seat a reservation with more people than the capacity of the table.
   - display a `Submit` button that, when clicked, assigns the table to the reservation then displays the `/dashboard` page
   - POST to `/tables/:table_id/seat/:reservation_id` in order to save the table assignment. The tests do not check the body returned by this POST.
   - if the table capacity is less than the number of people in the reservation return 400 with an error message.
   - if the table is occupied return 400 with an error message.
   - display a `Cancel` button that, when clicked, returns the user to the previous page
1. The `tables` table will be seeded with the following tables:
   - `Bar #1` & `Bar #2` Each with a capacity of 1.
   - `#1` & `#2`. Each with a capacity of 6.

### US-5 Finish an occupied table

As a restaurant manager
I want to free up an occupied table when the guests leave
so that I can seat more guests at that table.

#### Acceptance Criteria

1. The `/dasboard` page will
   - Display a "Finish" button on each _occupied_ table.
   - the "Finish" button must have a `data-finish-reservation-id={reservation.reservation_id}` attribute, so it can be found by the tests.
   - Clicking the "Finish" button will display the following confirmation: "Is this table ready to seat new guests? This cannot be undone."
     - If the user selects "Ok" the system will:
     - Send a `DELETE` request to `/tables/:table_id/seat/:reservation_id` in order to remove the table assignment. The tests do not check the body returned by this request.
       - the server should return 400 if the table is not occupied, or if the seated `reservation_id` does not match the reservation_id in the url.
     - Refresh the list of tables to show that the table is now available.
     - If the user selects "Cancel" no changes are made.
	
> **Hint** The end-to-end test waits for the tables list to be refreshed before checking the free/occupied status of the table so be sure to send a GET request to `/tables` to refresh the tables list.

### US-6 Reservation Status

As a restaurant manager
I want to see the status of a reservation as one of: booked, arrived, seated, finished
so that I can use the history of reservations to estimate future staffing and ordering needs.

#### Acceptance Criteria

1. The `/tables/:table_id/seat` page will
   - have the following required and not-nullable fields.
     - First name: `<input name="first_name" />`
     - Last name: `<input name="last_name" />`
     - Mobile number: `<input name="mobile_number" />`
     - Number of people in the party, which must be at least 1 person. `<input name="people" />`
   - display a `Submit` button that, when clicked, saves a new reservation record for the current date and time and saves the table assignment, then displays the `/dashboard` page
   - display a `Cancel` button that , when clicked, returns the user to the previous page.

### US-7 Search for a reservation by phone number

As a restaurant manager
I want to search a reservation by a phone number (partial or complete)
so that I can easily and quickly access a customer's reservation.

#### Acceptance Criteria

1. The `/search` page will
   - Display a search box `<input name="mobile_number" />` that displays the placeholder text: "Enter a customer's phone number"
   - Display a "Find" button next to the search box.
   - Clicking on the "Find" button will submit a request to the server (e.g. GET `/reservations?mobile_phone=555-1212`).
     - then the system will look for the reservation(s) in the database and display all matched records on the `/search` page using the reservations list component as the `/dashboard` page.
   - If there are no records found after clicking find, then display a message `No reservations found`.

> **Hint** To search for a partial or complete phone number, you should ignore all formatting and search only for the digits.
> You will need to remove any non-numeric characters from the submitted mobile number and also use the PostgreSQL translate function.
>
> The following function will perform the correct search.
>
> ```javascript
> function search(mobile_number) {
>   return knex("reservations")
>     .whereRaw(
>       "translate(mobile_number, '() -', '') like ?",
>       `%${mobile_number.replace(/\D/g, "")}%`
>     )
>     .orderBy("reservation_date");
> }
> ```

### US-8 Make changes to an existing reservation

As a restaurant manager
I want to make changes to a reservation
so that I know how many customers will arrive at the restaurant on a given day.

#### Acceptance Criteria

1. The `/dashboard` and the `/search` page will
   - Display an "Edit" button next to each reservation
     - Clicking the "Edit" button will navigate the user to the `/reservations/:reservation_id/edit` page
   - the "Edit" button must be a link with an `href` attribute that equals `/reservations/${reservation_id}/edit`, so it can be found by the tests.
   - Display a "Cancel" button next to each reservation
     - Clicking the "Cancel" button will display the following confirmation: "Do you want to cancel this reservation? This cannot be undone."
       - If the user selects "Ok", the reservation is removed from the page and deleted from the database, the confirmation disappears, and the results on the page are refreshed.
       - If the user selects "Cancel" no changes are made.
1. The `/reservations/:reservation_id/edit` page will display the reservation form with the existing reservation data filled in
   - If the user selects "Submit", the reservation is updated, then the user is taken back to the previous page.
   - If the user selects "Cancel" no changes are made.
