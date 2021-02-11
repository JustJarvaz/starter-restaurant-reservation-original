const puppeteer = require("puppeteer");
const fs = require("fs");
const fsPromises = fs.promises;
const generateNextDate = require("./utils/generateNextDate");

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

describe("/reservations/new page", () => {
  let page;
  let browser;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
  });

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    // page.on("console", onPageConsole);
    await page.goto(`${baseURL}/reservations/new`, { waitUntil: "load" });
  });

  afterEach(async () => {
    await browser.close();
  });

  describe("us-2 reservation form validation", () => {
    beforeEach(async () => {
      await page.type("input[name=first_name]", "John");
      await page.type("input[name=last_name]", "Doe");
      await page.type("input[name=mobile_number]", "1234567890");
      await page.type("input[name=people]", "3");
    });

    it("should display an error message if the date/time of the reservation occurs in the past", async () => {
      await page.focus("input[name=reservation_date]");
      await page.keyboard.type("12242019");
      await page.type("input[name=reservation_time]", "05:30PM");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-future-before.png",
      });

      await page.click("button[type=submit]");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-future-after.png",
      });

      expect(await page.$("[data-test=errors]")).toBeTruthy();
    });

    it("should display an error message if reservation date falls on a non-working day", async () => {
      await page.focus("input[name=reservation_date]");
      await page.keyboard.type(generateNextDate(false));
      await page.type("input[name=reservation_time]", "05:30PM");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-working-day-before.png",
      });

      await page.click("button[type=submit]");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-working-day-after.png",
      });

      expect(await page.$("[data-test=errors]")).toBeTruthy();
    });
  });
});
