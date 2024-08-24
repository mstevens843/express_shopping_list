const request = require("supertest");
const app = require("../app");
let shoppingList = require("../shoppingListDb");

beforeEach(function () {
  shoppingList.push({ name: "popsicle", price: 1.45 });
});

afterEach(function () {
  shoppingList.length = 0;
});

describe("GET /items", function () {
  it("should get a list of items", async function () {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([{ name: "popsicle", price: 1.45 }]);
  });
});

describe("POST /items", function () {
  it("should add a new item", async function () {
    const resp = await request(app)
      .post("/items")
      .send({ name: "cheerios", price: 3.40 });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      added: { name: "cheerios", price: 3.40 },
    });
    expect(shoppingList.length).toBe(2);
  });

  it("should return 400 if name or price is missing", async function () {
    const resp = await request(app).post("/items").send({ name: "milk" });
    expect(resp.statusCode).toBe(400); // You need to add validation logic for this in the route.
  });
});

describe("GET /items/:name", function () {
  it("should get a single item by name", async function () {
    const resp = await request(app).get("/items/popsicle");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  });

  it("should return 404 if item is not found", async function () {
    const resp = await request(app).get("/items/nonexistent");
    expect(resp.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", function () {
  it("should update an item's name and/or price", async function () {
    const resp = await request(app)
      .patch("/items/popsicle")
      .send({ name: "new popsicle", price: 2.45 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "new popsicle", price: 2.45 },
    });
  });

  it("should return 404 if item is not found", async function () {
    const resp = await request(app).patch("/items/nonexistent").send({
      name: "nothing",
    });
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", function () {
  it("should delete an item", async function () {
    const resp = await request(app).delete("/items/popsicle");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
    expect(shoppingList.length).toBe(0);
  });

  it("should return 404 if item is not found", async function () {
    const resp = await request(app).delete("/items/nonexistent");
    expect(resp.statusCode).toBe(404);
  });
});

  