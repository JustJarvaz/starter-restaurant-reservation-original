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

See [./rubric.md](./rubric.md). Update the rubric as you complete each user story.

## Open Questions

- Can Qualified run and test a mono-repo?

> No

- Does NPM correctly handle a mono-repo on Windows?

> No. `npm --previx ./front-end install` has a [bug](https://github.com/npm/cli/issues/1290) that installs binary scripts in the wrong location.
>
> Before release to the students we will have to find an alternative. Most likely solution is to split the repositories.

## TODO

1. Hou: Remove Math.random() from any tests - random data in a test in not deterministic and makes it impossible to debug certain failures.
1. Create starter-code repos for front-end and back-end repos (Dale is investigating Github actions)
1. Make it possible to run each test suite at a time, and display test output to more clearly show which tests have failed (and possibly hide e2e test logs for passing tests).
1. Update final-capstone checkpoints with any additional info, if needed. Link starter repos to web-dev repo

## Missing content

This section lists things that the student must know about to successfully complete this capstone but may potentially be missing from earlier checkpoints

- Working with a mono-repo
- Deploying a mono-repo to vercel
- Using a separate database for testing - DDL did not see a test environment database covered in Knex.
- Automatically running latest migrations when application starts - didn't see this either
- e2e tests and screen shots
- asyncErrorBoundary is missing from Knex content.
