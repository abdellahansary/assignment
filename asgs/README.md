# Assignment 7 - Express.js + MongoDB

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Mongo connection string if it's not local.
3. Make sure MongoDB is running (`mongod` locally, or point `MONGO_URI` at Atlas).
4. `npm start` (or `npm run dev` with nodemon).

Server runs on `http://localhost:3000`.

## Structure

```
src/
  config/db.js        - mongo client/connection
  controllers/         - route handlers, one file per resource
  routes/               - express routers
  app.js                - express app, mounts routes
server.js               - entry point, connects to db then starts server
mongosh-solutions.txt   - same 19 questions solved directly in the mongo shell
bonus.js                 - LeetCode 13, Roman to Integer
```

## Endpoints

- `POST /collection/books` - create "books" with a validator requiring non-empty title
- `POST /collection/authors` - implicit collection, insert to create
- `POST /collection/logs/capped` - capped collection, 1MB
- `POST /collection/books/index` - index on title
- `POST /books` - insert one book
- `POST /books/batch` - insert 3+ books (send an array in the body)
- `POST /logs` - insert a log, body: `{ "book_id": "<a real books _id>", "action": "borrowed" }`
- `PATCH /books/:title` - e.g. `PATCH /books/Future`, body `{ "year": 2022 }`
- `GET /books/title?title=Brave New World`
- `GET /books/year?from=1990&to=2010`
- `GET /books/genre?genre=Science Fiction`
- `GET /books/skip-limit`
- `GET /books/year-integer`
- `GET /books/exclude-genres`
- `DELETE /books/before-year?year=2000`
- `GET /books/aggregate1` / `aggregate2` / `aggregate3` / `aggregate4`

Note: for `aggregate4` to actually return matches, the `book_id` you insert into `logs`
needs to be the real `ObjectId` of a document already in `books` - the `$lookup` joins
on `logs.book_id == books._id`.
