# Rubric: Restaurant Reservations

## Handy links

[Web Development Team Philosophy on Rubrics Doc](https://chegg-my.sharepoint.com/:w:/p/rcosgrove/ERZ52ctF-QJFlvE5J7DWnHEBqxdJa3zaOc7eMU0NMnmRNA?e=7imjI2)
[Flashcard App Qualified challenge with solution files](https://www.qualified.io/hire/challenges/5f9c45c570e051000a3c00ab)

## Rubric questions

All the following questions should be answered in the affirmative for the project to be passed.

- Are all the tests passing?
- Are all business rules enforced in UI, API, and (if possible) the database?
- Do the Edit and Create components share the same form component?
- Do all API call make use of an AbortController?
- Do all API call make abort without error e.g. navigate previous very quickly in the dashboard?

# Feedback form

## Well done

If you see any of the following, they could be included in the “well done” comments.

- Use of prop.types. At this point, the student has not yet learned about these, so any use of prop types shows that they are researching beyond the lesson.
- Use of <> and </>. At this point, the student has not yet learned about fragments, so any use shows that they are researching beyond the lesson.
- Any pure functions.
- Any clear and informative variable or function names.
- Code that is grouped by route or resource.

## Areas for improvement

If you see any of the following, they could be included in the “areas for improvement” comments.

- Any non-pure functions that could be changed into pure functions.
- Any variable or function names that could be improved.
- Missing use of AbortController and signal to terminate API calls when it is likely for the user navigates away from a component while it is still loading.
- Improper time zone for dates when using the system close to 00:00 GMT. This will show up in validation when GMT switches to the next date but local time is before 22:30. Change the time on your machine to test locally.
- Updating of status of a reservation and creation of the related event are not contained in a transaction
- Updating the status of a reservation does not return a 500 level status code if the transaction fails
- Events are displayed sorted to make them easier to read - some sort order other than event_id.
