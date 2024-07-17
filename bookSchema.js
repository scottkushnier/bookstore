const bookSchema = {
  type: "object",
  properties: {
    isbn: { type: "string" },
    amazon_url: { type: "string", pattern: "^http(s)?://(.*..*/.*)$" },
    author: { type: "string", pattern: "^[A-Z].* [A-Z].*$" },
    language: { type: "string" },
    pages: { type: "integer" },
    publisher: { type: "string" },
    title: { type: "string" },
    year: { type: "integer", maximum: 2025 },
  },
  required: [
    "isbn",
    "amazon_url",
    "author",
    "language",
    "pages",
    "publisher",
    "title",
    "year",
  ],
};

module.exports = bookSchema;
