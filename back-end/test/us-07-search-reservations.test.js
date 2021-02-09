const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("Search reservation by phone number", () => {
  beforeAll(() => {
    return knex.migrate
      .forceFreeMigrationsLock()
      .then(() => knex.migrate.rollback(null, true))
      .then(() => knex.migrate.latest());
  });

  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(async () => {
    return await knex.migrate.rollback(null, true).then(() => knex.destroy());
  });

  describe("GET /reservations/search", () => {
    test("returns reservations for a given phone number", async () => {
      const response = await request(app)
        .get("/reservations/search?phone=1231231234")
        .set("Accept", "application/json");
      console.log(response.body.data);
      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toHaveLength(2);
    });

    test("returns 400 for an invalid search value", async () => {
      const response = await request(app)
        .get("/reservations/search?phone=12312312asdf")
        .set("Accept", "application/json");

      expect(response.body.error).toBeDefined();
      expect(response.status).toBe(400);
    });
  });
});
