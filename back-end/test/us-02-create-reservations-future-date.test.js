const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("Create reservations future date", () => {
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

  describe("POST /reservations", () => {
    test("returns 400 if reservation does not occur in the future", async () => {
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "1999-01-01",
        reservation_time: "17:30",
        people: 3,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.status).toBe(400);
    });
    test("returns 400 if reservation_date falls on a non-working day", async () => {
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2030-01-01",
        reservation_time: "17:30",
        people: 3,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.status).toBe(400);
    });
  });
});
