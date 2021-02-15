const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-05 - Finish an occupied table", () => {
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

  describe("DELETE /tables/:table_id/seat/:reservation_id", () => {
    let barTableOne;
    let tableOne;

    beforeEach(async () => {
      barTableOne = await knex("tables").where("table_name", "Bar #1").first();
      tableOne = await knex("tables").where("table_name", "#1").first();
    });

    test("returns 404 for non-existent table_id", async () => {
      const response = await request(app)
        .delete("/tables/99/seat/1")
        .set("Accept", "application/json")
        .send({ datum: {} });

      expect(response.body.error).toContain("99");
      expect(response.status).toBe(404);
    });

    test("returns 400 if table_id is not occupied.", async () => {
      const response = await request(app)
        .delete("/tables/1/seat/1")
        .set("Accept", "application/json")
        .send({});

      expect(response.body.error).toContain("not occupied");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_id in url does not match seated reservation_id", async () => {
      const seatResponse = await request(app)
        .post(`/tables/${tableOne.table_id}/seat/1`)
        .set("Accept", "application/json")
        .send({});

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .delete(`/tables/${tableOne.table_id}/seat/3`)
        .set("Accept", "application/json")
        .send({});

      expect(finishResponse.body.error).toContain("3");
      expect(finishResponse.status).toBe(400);
    });

    test("returns 200 if table_id is occupied and reservation_id matches", async () => {
      const seatResponse = await request(app)
        .post(`/tables/${tableOne.table_id}/seat/1`)
        .set("Accept", "application/json")
        .send({});

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .delete(`/tables/${tableOne.table_id}/seat/1`)
        .set("Accept", "application/json")
        .send({});

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.status).toBe(200);
    });
  });
});
