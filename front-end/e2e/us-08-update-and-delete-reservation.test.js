const puppeteer = require("puppeteer");
const fs = require("fs");
const { createReservation } = require("./api");
const fsPromises = fs.promises;

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

describe("US-08 - Make changes to an existing reservation - E2E", () => {
  let page;
  let browser;
  let reservation;

  const dashboardTestPath = `${baseURL}/dashboard?date=2035-01-04`;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    browser = await puppeteer.launch();

    reservation = await createReservation({
      first_name: "James",
      last_name: Date.now().toString(10),
      mobile_number: "555-1212",
      reservation_date: "2035-01-04",
      reservation_time: "14:00",
      people: 2,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    page.on("console", onPageConsole);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("/dashboard", () => {
    it("the Edit button is a link to the /reservations/:reservation_id/edit page", async () => {
      await page.goto(dashboardTestPath, {
        waitUntil: "networkidle0",
      });

      await page.screenshot({
        path: ".screenshots/us-08-dashboard-edit-click-before.png",
        fullPage: true,
      });

      const hrefSelector = `[href="/reservations/${reservation.reservation_id}/edit"]`;
      await page.waitForSelector(hrefSelector);

      await page.screenshot({
        path: ".screenshots/us-08-dashboard-edit-click-after.png",
        fullPage: true,
      });

      const containsEdit = await page.evaluate((hrefSelector) => {
        return document
          .querySelector(hrefSelector)
          .innerText.toLowerCase()
          .includes("edit");
      }, hrefSelector);

      expect(containsEdit).toBe(true);
    });
  });

  describe("/reservations/:reservation_id/edit", () => {
    beforeEach(async () => {
      await page.goto(`${baseURL}/dashboard`, {
        waitUntil: "networkidle0",
      });
      await page.goto(
        `${baseURL}/reservations/${reservation.reservation_id}/edit`,
        {
          waitUntil: "networkidle0",
        }
      );
    });

    it("canceling form returns to the previous page", async () => {
      const [cancelButton] = await page.$x(
        "//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'cancel')]"
      );

      if (!cancelButton) {
        throw new Error("button containing cancel not found.");
      }

      await page.screenshot({
        path: ".screenshots/us-08-edit-reservation-cancel-before.png",
        fullPage: true,
      });

      await Promise.all([
        cancelButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({
        path: ".screenshots/us-08-edit-reservation-cancel-after.png",
        fullPage: true,
      });

      await expect(page.url()).toContain("/dashboard");
    });

    it("filling and submitting form updates the reservation", async () => {
      const firstNameInput = await page.$("input[name=first_name]");
      await firstNameInput.click({ clickCount: 3 });
      await firstNameInput.type("John");

      const [submitButton] = await page.$x(
        "//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'submit')]"
      );

      if (!submitButton) {
        throw new Error("button containing submit not found.");
      }

      await page.screenshot({
        path: ".screenshots/us-08-edit-reservation-submit-before.png",
        fullPage: true,
      });

      await Promise.all([
        submitButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await expect(page.url()).toContain("/dashboard");

      await page.screenshot({
        path: ".screenshots/us-08-edit-reservation-submit-after.png",
        fullPage: true,
      });

      await expect(page).toMatch(/John/);
    });
  });

  describe("dashboard cancel button", () => {
    it("deletes a reservation", async () => {
      await page.goto(dashboardTestPath, {
        waitUntil: "networkidle0",
      });

      const [cancelButton] = await page.$x(
        "//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'cancel')]"
      );

      if (!cancelButton) {
        throw new Error("button containing cancel not found.");
      }

      await page.screenshot({
        path: ".screenshots/us-08-delete-reservation-before.png",
        fullPage: true,
      });

      await cancelButton.click();

      await page.screenshot({
        path: ".screenshots/us-08-delete-reservation-after.png",
        fullPage: true,
      });

      expect(await page.content()).not.toMatch(/555-1212/);
    });
  });
});
