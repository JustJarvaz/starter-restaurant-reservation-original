const puppeteer = require("puppeteer");
const fs = require("fs");
const fsPromises = fs.promises;

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

describe("/reservations/search", () => {
  let page;
  let browser;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
  });

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.on("console", onPageConsole);
    await page.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle0" });
  });

  afterEach(async () => {
    await browser.close();
  });

  describe("us-07 search reservations", () => {
    it("entering an invalid phone number and submitting displays an error message", async () => {
      await page.type("input[name=reservations_search]", "123123asdf");

      await page.screenshot({
        path:
          ".screenshots/us-07-search-reservations-submit-invalid-before.png",
        fullPage: true,
      });

      await page.click("button[type=submit]");

      await page.screenshot({
        path: ".screenshots/us-07-search-reservations-submit-invalid-after.png",
        fullPage: true,
      });

      await expect(page).toMatch(/Error/);
    });

    it("entering a valid phone number and submitting displays the matched records", async () => {
      await page.type("input[name=reservations_search]", "1231231234");

      await page.screenshot({
        path: ".screenshots/us-07-search-reservations-submit-valid-before.png",
        fullPage: true,
      });

      await page.click("button[type=submit]");

      await page.screenshot({
        path: ".screenshots/us-07-search-reservations-submit-valid-after.png",
        fullPage: true,
      });
      await expect(page).toMatch(/Tiger/);
    });

    it("entering a valid phone number and submitting displays a No reservation found message", async () => {
      await page.type("input[name=reservations_search]", "1231231232");

      await page.screenshot({
        path:
          ".screenshots/us-07-search-reservations-submit-no-result-before.png",
        fullPage: true,
      });

      await page.click("button[type=submit]");

      await page.screenshot({
        path:
          ".screenshots/us-07-search-reservations-submit-no-result-after.png",
        fullPage: true,
      });
      await expect(page).toMatch(/No reservation found/);
    });
  });
});
