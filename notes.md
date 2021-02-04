# NOTES for Dale and Hou ONLY:

**NB**: This is repo will become the solution, which is not visible to the student.
As a result, we don't need to worry about whether the student will understand the code in this project.

> Roughly 10 one-day user stories for a proficient student
>
> Each story results in a functional reservation system
>
> Stories progressively build on existing functionality
>
> Encourage outside-in development by specifying functionality in terms of UI
>
> Encourage the student to deploy after each user story.

## Rubric

See [./rubric.md](./rubric.md)

## Open Questions

- Can Qualified run and test a mono-repo?

> No

- Does NPM correctly handle a mono-repo on Windows?

> No. `npm --previx ./front-end install` has a [bug](https://github.com/npm/cli/issues/1290) that installs binary scripts in the wrong location. 
> 
> Before release to the students we will have to find an alternative. Most likely solution is to split the repositories.

## Missing content

This section lists things that the student must know about to successfully complete this capstone but may potentially be missing from earlier checkpoints

- Working with a mono-repo
- Deploying a mono-repo to vercel
- Using a separate database for testing - DDL did not see a test environment database covered in Knex.
- Automatically running latest migrations when application starts - didn't see this either
- e2e tests and screen shots

## Backlog brain dump

Obviously this is more than 10 one-day stories - this is just a brain dump of ideas.

Add or remove ideas as you see fit.

When you pick up an item, let the other person know what you are starting.

### Reservations

- Update reservation
- Cancel reservation
- Search for reservation by date
- Search for reservation by name
- Search for reservation by mobile number
- Capture email address for reservation
- Capture optional occasion for reservation (birthday, anniversary, work celebration)
- Capture how the customer heard about the restaurant
- Capture how the name of the person that took the reservation
- Do not allow reservations before opening
- The duration of the reservation is calculated by the system based on something in settings - eventually historical data
- Look up details for past customer by name or phone number

### Wait list

- Add people to the wait list if all tables are booked for a future date
- Add walk-in groups to the wait list for same day

### Tables

- Specify the "default" set of tables
- A table has an ID, a capacity (and a location?)
- Assign a reservation to a table
- Warn user when assigning a table that is too small
- Assign a reservation to multiple tables, if necessary

### Customers

- Maintain history of reservations by customer
- When a past customer makes a new reservation, default table assignment to their last table - prompt staff to ask if they want the same table again
- Report on the most loyal customer
- Return on the new/return ratio

### Staff

- Assign a waiter to a table
- Do not allow assignment of a table to a waiter that is not working that day

### Settings/Restaurant/Company

- specify normal business hours
- override business hours on specific dates
- specify normal table configuration
- override tables on specific dates
- specify the normal duration for a reservation - may be specific to the number of people
- override the normal duration for a reservation on specific dates
- specify the latest reservation time relative to closing - e.g. 60 minutes
- specify the reservation time increments as 10, 15, or 30 minutes
- Changing time increment does not impact existing reservations
- Overriding or Changing business hours displays list of conflicting reservations, if any
- Support "walk-in" customers - no reservation - capture name, number, etc and assign table.
- specify a minimum party size for a reservation

### Dashboard

- Lists reservations for a single date
- Quickly "jump" to a specific date on the dashboard
- Lists total number of customers by the current reservation time increment
- Lists each table, the guest at each table, and the waiter currently assigned to the table, and the estimated time the table will leave
- Show status of reservation - booked, arrived, seated, finished, wait listed, canceled, or no show
- Shows the estimated wait time for walk-in customers

### Reports

- Does size of party impact length of time the party is seated
- How many reservations per day or any given number of hours
- Average size of party making a reservation
- The Busiest days and times report
- the slowest days and times report - when to have happy hours
- Upcoming staffing requirements based on future reservations
