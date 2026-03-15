import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("carga la página principal", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Luis Araya|Full Stack Developer/i);
  });

  test("muestra la sección Proyectos con cards y Ver más", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /proyectos/i }).first().click();
    await expect(page.getByRole("heading", { name: "Proyectos" })).toBeVisible();
    await page.getByRole("heading", { name: "Proyectos" }).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByRole("button", { name: /ver más|descripción completa/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Proyectos – recortes y layout", () => {
  test("la última card de proyectos no está cortada (desktop)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /proyectos/i }).first().click();
    const section = page.getByTestId("projects-section-desktop").first();
    await section.waitFor({ state: "visible", timeout: 10000 });
    await page.evaluate(() => window.scrollBy(0, 2000));
    const cardNoCortada = await page.evaluate(() => {
      const sec = document.querySelector("[data-testid='projects-section-desktop']");
      const cards = document.querySelectorAll("[data-testid='project-card']");
      if (!sec || cards.length === 0) return false;
      const last = cards[cards.length - 1] as HTMLElement;
      const secRect = sec.getBoundingClientRect();
      const cardRect = last.getBoundingClientRect();
      const secBottom = secRect.top + secRect.height;
      const cardBottom = cardRect.top + cardRect.height;
      return cardBottom <= secBottom + 2;
    });
    expect(cardNoCortada).toBe(true);
  });

  test("la última card de proyectos no está cortada (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/#projects");
    const section = page.getByTestId("projects-section-mobile").first();
    await section.waitFor({ state: "visible", timeout: 15000 });
    const lastCard = page.getByTestId("project-card").last();
    await lastCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const cardNoCortada = await page.evaluate(() => {
      const cards = document.querySelectorAll("[data-testid='project-card']");
      if (cards.length === 0) return false;
      const last = cards[cards.length - 1] as HTMLElement;
      const rect = last.getBoundingClientRect();
      return rect.bottom <= window.innerHeight + 2;
    });
    expect(cardNoCortada).toBe(true);
  });
});

test.describe("Proyectos – regresión visual", () => {
  test("sección Proyectos coincide con el estilo de referencia", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /proyectos/i }).first().click();
    await page.getByRole("heading", { name: "Proyectos" }).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 350));
    await page.waitForTimeout(300);
    const section = page.getByTestId("projects-section-desktop").or(page.getByTestId("projects-section-mobile")).first();
    await expect(section).toHaveScreenshot("projects-section.png", { maxDiffPixels: 200 });
  });
});
