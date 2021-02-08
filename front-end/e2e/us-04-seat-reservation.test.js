const { selectOptionByText } = require("./utils");

const puppeteer = require("puppeteer");

const fs = require("fs");
const fsPromises = fs.promises;

const { createReservation } = require("./api");

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );
`/tables/new`;

describe("US-04 - Seat reservation - E2E", () => {
  let page;
  let browser;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    browser = await puppeteer.launch({ args: ["--start-maximized"] });
    page = await browser.newPage();
    page.on("console", onPageConsole);
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("Create Table Page", () => {
    beforeEach(async () => {
      await page.goto(`${baseURL}/tables/new`, { waitUntil: "networkidle0" });
      await page.reload({ waitUntil: "networkidle0" });
    });

    describe("/tables/new", () => {
      test("filling and submitting form creates a new table", async () => {
        const tableName = `#${Date.now().toString(10)}`;

        await page.type("input[name=table_name]", tableName);
        await page.type("input[name=capacity]", "6");

        await page.screenshot({
          path: ".screenshots/us-04-create-table-submit-before.png",
          fullPage: true,
        });

        await Promise.all([
          page.click("button[type=submit]"),
          page.waitForNavigation({ waitUntil: "networkidle0" }),
        ]);

        await page.screenshot({
          path: ".screenshots/us-04-create-table-submit-after.png",
          fullPage: true,
        });

        await expect(page).toMatch(tableName);
      });
      test("omitting table_name and submitting does not create a new table", async () => {
        await page.type("input[name=capacity]", "3");

        await page.screenshot({
          path: ".screenshots/us-04-omit-table-name-before.png",
          fullPage: true,
        });

        await page.click("button[type=submit]");

        await page.screenshot({
          path: ".screenshots/us-04-omit-table-name-after.png",
          fullPage: true,
        });

        await expect(page.url()).toContain("/tables/new");
      });
      test("entering a single character table_name and submitting does not create a new table", async () => {
        await page.type("input[name=table_name]", "1");
        await page.type("input[name=capacity]", "6");

        await page.screenshot({
          path: ".screenshots/us-04-short-table-name-before.png",
          fullPage: true,
        });

        await page.click("button[type=submit]");

        await page.screenshot({
          path: ".screenshots/us-04-short-table-name-after.png",
          fullPage: true,
        });

        await expect(page.url()).toContain("/tables/new");
      });
      test("omitting capacity and submitting does not create a new table", async () => {
        await page.type("input[name=table_name]", "Omit capacity");

        await page.screenshot({
          path: ".screenshots/us-04-omit-capacity-before.png",
          fullPage: true,
        });

        await page.click("button[type=submit]");

        await page.screenshot({
          path: ".screenshots/us-04-omit-capacity-after.png",
          fullPage: true,
        });

        await expect(page.url()).toContain("/tables/new");
      });
      test("canceling form returns to previous page", async () => {
        await page.goto(`${baseURL}/reservations/new`, {
          waitUntil: "networkidle0",
        });
        await page.goto(`${baseURL}/tables/new`, {
          waitUntil: "networkidle0",
        });

        const [cancelButton] = await page.$x(
          "//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'cancel')]"
        );

        if (!cancelButton) {
          throw new Error("button containing cancel not found.");
        }

        await page.screenshot({
          path: ".screenshots/us-04-create-table-cancel-before.png",
          fullPage: true,
        });

        await Promise.all([
          cancelButton.click(),
          page.waitForNavigation({ waitUntil: "networkidle0" }),
        ]);

        await page.screenshot({
          path: ".screenshots/us-04-create-table-cancel-after.png",
          fullPage: true,
        });

        await expect(page.url()).toContain("/reservations/new");
      });
    });
  });

  describe("Seat reservation page", () => {
    let reservation;

    beforeEach(async () => {
      reservation = await createReservation({
        first_name: "Seat",
        last_name: Date.now().toString(10),
        mobile_number: "555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:45",
        people: 4,
      });

      await page.goto(
        `${baseURL}/reservations/${reservation.reservation_id}/seat`,
        {
          waitUntil: "networkidle0",
        }
      );
      await page.reload({ waitUntil: "networkidle0" });
    });

    test("seating reservation at table #1 makes the table occupied", async () => {
      await page.waitForSelector('option:not([value=""])');

      await page.screenshot({
        path: ".screenshots/us-04-seat-reservation-start.png",
        fullPage: true,
      });

      await selectOptionByText(page, "table_id", "#1 - 6");

      await page.screenshot({
        path: ".screenshots/us-04-seat-reservation-submit-before.png",
        fullPage: true,
      });

      await Promise.all([
        page.click("[type=submit]"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({
        path: ".screenshots/us-04-seat-reservation-submit-after.png",
        fullPage: true,
      });

      await expect(page.url()).toContain("/dashboard");
      await expect(page).toMatch(/occupied/i);
    });
    test("cannot seat reservation at Bar #1", () => {});
  });
});