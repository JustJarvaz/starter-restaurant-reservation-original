const puppeteer = require("puppeteer");
const fs = require("fs");
const fsPromises = fs.promises;

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

describe("US-08 - Update and delete reservation - E2E", () => {
  let page;
  let browser;
  const dashboardTestPath = `${baseURL}/dashboard?date=2025-01-02`;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`${baseURL}/reservations/new`, { waitUntil: "load" });
    await page.type("input[name=first_name]", "James");
    await page.type("input[name=last_name]", "Doe");
    await page.type("input[name=mobile_number]", "555-1212");
    await page.type("input[name=reservation_date]", "01022025");
    await page.type("input[name=reservation_time]", "1330");
    await page.type("input[name=people]", "2");
    await Promise.all([
      page.click("[type=submit]"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
  });

  beforeEach(async () => {
    page.on("console", onPageConsole);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("/dashboard", () => {
    it("clicking on the Edit button takes the user to the /reservations/update/:reservation_id page", async () => {
      await page.goto(dashboardTestPath, {
        waitUntil: "networkidle0",
      });

      await page.screenshot({
        path: ".screenshots/us-08-dashboard-edit-click-before.png",
        fullPage: true,
      });

      const [editButton] = await page.$x(
        "//a[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'edit')]"
      );

      if (!editButton) {
        throw new Error("button containing edit not found.");
      }

      await Promise.all([
        editButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({
        path: ".screenshots/us-08-dashboard-edit-click-after.png",
        fullPage: true,
      });

      await expect(page.url()).toContain("/reservations/update");
    });
  });
  describe("/reservations/update/:reservation_id", () => {
    beforeEach(async () => {
      await page.goto(dashboardTestPath, {
        waitUntil: "networkidle0",
      });

      const [editButton] = await page.$x(
        "//a[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'edit')]"
      );

      await Promise.all([
        editButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.goto(`${page.url()}`, {
        waitUntil: "networkidle0",
      });
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

      await page.goto(dashboardTestPath, {
        waitUntil: "networkidle0",
      });

      await page.screenshot({
        path: ".screenshots/us-08-edit-reservation-submit-after.png",
        fullPage: true,
      });

      await expect(page).toMatch(/John/);
    });
  });

  describe("reservation delete", () => {
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
