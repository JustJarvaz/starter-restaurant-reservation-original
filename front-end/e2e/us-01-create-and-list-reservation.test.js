const puppeteer = require("puppeteer");
const fs = require('fs');
const fsPromises = fs.promises;

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

describe("Create Reservation Page", () => {
  let page;
  let browser;

  beforeAll(async () => {
    await fsPromises.mkdir('./.screenshots', { recursive:true })
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.on("console", onPageConsole);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.goto(`${baseURL}/reservations/new`, { waitUntil: "load" });
  });

  describe("/reservations/new", () => {
    test("filling and submitting form creates a new reservation", async () => {
      const lastName = Date.now().toString(10);

      await page.type("input[name=first_name]", "James");
      await page.type("input[name=last_name]", lastName);
      await page.type("input[name=mobile_number]", "555-1212");
      await page.type("input[name=reservation_date]", "01012025");
      await page.type("input[name=reservation_time]", "1330");
      await page.type("input[name=people]", "2");

      await page.screenshot({path: '.screenshots/us-01-submit-before.png'})

      await Promise.all([
        page.click("button[type=submit]"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({path: '.screenshots/us-01-submit-after.png'})

      await expect(page).toMatch(lastName);
    });
    test("canceling form creates returns to previous page", async () => {
      await page.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle0" });
      await page.goto(`${baseURL}/reservations/new`, {
        waitUntil: "networkidle0",
      });

      const [cancelButton] = await page.$x("//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'cancel')]");

      if (!cancelButton) {
        throw new Error("button containing cancel not found.")
      }

      await page.screenshot({path: '.screenshots/us-01-cancel-before.png'})

      await Promise.all([
        cancelButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({path: '.screenshots/us-01-cancel-after.png'})

      await expect(page.url()).toContain("/dashboard");
    });
  });
});
