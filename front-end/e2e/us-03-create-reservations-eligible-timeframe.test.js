const puppeteer = require("puppeteer");
const fs = require("fs");
const fsPromises = fs.promises;

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
    page.on("console", onPageConsole);
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

    it("should display an error message if reservation time is before the open time", async () => {
      await page.type("input[name=reservation_date]", "02022026");
      await page.type("input[name=reservation_time]", "10:15AM");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-early-before.png",
      });

      await page.click("button[type=submit]");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-early-after.png",
      });

      expect(await page.$(".alert-danger")).toBeTruthy();
    });

    it("should display an error message if reservation time is too close to close time", async () => {
      await page.type("input[name=reservation_date]", "02022026");
      await page.type("input[name=reservation_time]", "1005PM");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-almost-closing-before.png",
      });

      expect(await page.$(".alert-danger")).toBeFalsy();

      await page.click("button[type=submit]");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-almost-closing-after.png",
      });

      expect(await page.$(".alert-danger")).toBeTruthy();
    });

    it("should display an error message if reservation time is after the close time", async () => {
      await page.type("input[name=reservation_date]", "02022026");
      await page.type("input[name=reservation_time]", "1045PM");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-late-before.png",
      });

      expect(await page.$(".alert-danger")).toBeFalsy();

      await page.click("button[type=submit]");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-late-after.png",
      });

      expect(await page.$(".alert-danger")).toBeTruthy();
    });
  });
});
