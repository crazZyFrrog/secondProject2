import { expect, test } from "@playwright/test";

function uniqueEmail(prefix: string) {
  return `${prefix}_${test.info().workerIndex}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}@example.com`;
}

test("регистрация и вход на dashboard", async ({ page }) => {
  const email = uniqueEmail("e2e");
  await page.goto("/login");
  await page.getByRole("button", { name: "Регистрация" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Пароль").fill("secret12");
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Проекты" })).toBeVisible();
});

test("создание проекта", async ({ page }) => {
  const email = uniqueEmail("e2e_proj");
  await page.goto("/login");
  await page.getByRole("button", { name: "Регистрация" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Пароль").fill("secret12");
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByPlaceholder("Название проекта").fill("E2E Landing");
  await page.getByRole("button", { name: "Создать" }).click();
  await expect(page.getByText("E2E Landing")).toBeVisible();
});
