process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
const db = require("./db");

beforeEach(async function () {
  let resp = await db.query("DELETE FROM books");
});

afterAll(async function () {
  db.end();
});

describe("GET /books", function () {
  test("Gets all books", async function () {
    const resp = await request(app).get("/books");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.books.length).toEqual(0);
  });
});

describe("POST /books", function () {
  test("Post a book", async function () {
    const resp = await request(app).post("/books").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Duckett",
      language: "english",
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    expect(resp.statusCode).toBe(201);
  });
});

describe("POST /books", function () {
  test("Post and get book list", async function () {
    let resp = await request(app).post("/books").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Duckett",
      language: "english",
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    expect(resp.statusCode).toBe(201);
    ///
    resp = await request(app).get("/books");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.books.length).toEqual(1);
    ///
    resp = await request(app).post("/books").send({
      isbn: "0691161519",
      amazon_url: "http://a.co/eobPtX3",
      author: "Kyle Dent",
      language: "english",
      pages: 260,
      publisher: "O'Reilly",
      title: "Postfix, The Definitive Guide",
      year: 2004,
    });
    expect(resp.statusCode).toBe(201);
    ///
    resp = await request(app).get("/books");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.books.length).toEqual(2);
  });
});

describe("DELETE /books", function () {
  test("Post and delete a book", async function () {
    let resp = await request(app).post("/books").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Duckett",
      language: "english",
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    resp = await request(app).post("/books").send({
      isbn: "0691161519",
      amazon_url: "http://a.co/eobPtX3",
      author: "Kyle Dent",
      language: "english",
      pages: 260,
      publisher: "O'Reilly",
      title: "Postfix, The Definitive Guide",
      year: 2004,
    });
    ///
    resp = await request(app).delete("/books/0691161521");
    resp = await request(app).get("/books");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.books.length).toEqual(1);
  });
});

describe("PUT /books", function () {
  test("Post and change a book", async function () {
    let resp = await request(app).post("/books").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Duckett",
      language: "english",
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    resp = await request(app).put("/books/0691161521").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Q. Duckett",
      language: "english",
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    ///
    resp = await request(app).get("/books/0691161521");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.book.author).toEqual("Jon Q. Duckett");
  });
});

describe("POST /books, bad JSON", function () {
  test("Post a book with missing field", async function () {
    const resp = await request(app).post("/books").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      language: "english",
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    expect(resp.statusCode).toBe(400);
    expect(resp.text).toContain("instance requires property");
  });
});

describe("POST /books, bad JSON", function () {
  test("Post a book with bad type", async function () {
    const resp = await request(app).post("/books").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Duckett",
      language: 365,
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    expect(resp.statusCode).toBe(400);
    expect(resp.text).toContain("is not of a type");
  });
});

describe("PUT /books with bad JSON", function () {
  test("Post and change a book with bad JSON", async function () {
    let resp = await request(app).post("/books").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Duckett",
      language: "english",
      pages: 482,
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    resp = await request(app).put("/books/0691161521").send({
      isbn: "0691161521",
      amazon_url: "http://a.co/eobPtX5",
      author: "Jon Q. Duckett",
      language: "english",
      publisher: "Wiley & Sons",
      title: "HTML & CSS",
      year: 2011,
    });
    ///
    expect(resp.statusCode).toBe(400);
    expect(resp.text).toContain("instance requires property");
  });
});
