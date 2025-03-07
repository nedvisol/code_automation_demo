The "Book" entity represents the data related to a book written by an author.

This Book entity should have the following fields:
- ID as string
- Name as string, with max 500 characters length
- ISBN as string
- published date as date without timestamp
- Author ID as string, as a reference to Author entity

This entity will be persisted in the database directly using Data Access Object.