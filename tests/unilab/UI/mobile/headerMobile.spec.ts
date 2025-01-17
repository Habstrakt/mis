import { test, devices, expect } from '@playwright/test';
import { HeaderPage } from '../../../../pages/header.page';

let headerPage: HeaderPage;

test.use({
	locale: "ru-RU",
	geolocation: {latitude: 50.272796, longitude: 127.526943},
	permissions: ["geolocation"],
	...devices["Pixel 7"],
	isMobile: true
});

test.beforeEach(async({page}) => {
	headerPage = new HeaderPage(page);
	await page.goto("/", {waitUntil: "domcontentloaded"});
});

test("Открытие бургер-меню в мобильной версии", async ({page}) => {
	await headerPage.burgerMenuBtn.tap();
	await expect(page.locator("#headerBurgerBtn")).toHaveClass(/burger_open/);
});

test("Закрытие бургер-меню в мобильной версии", async({page}) => {
	await headerPage.burgerMenuBtn.tap();
	await expect(page.locator("#headerBurgerBtn")).toHaveClass(/burger_open/);
	await headerPage.burgerMenuBtn.tap();
	await expect(page.locator("#headerBurgerBtn")).not.toHaveClass(/burger_open/);
});

test("Работа переключателя темной/светлой версии в бургер-меню в мобильной версии", async({page}) => {
	await headerPage.burgerMenuBtn.tap();
	await headerPage.themeSwitcher.tap();
	await expect(page.locator("body")).toHaveClass(/theme-dark/);
	await headerPage.themeSwitcher.tap();
	await expect(page.locator("body")).not.toHaveClass(/theme-dark/);
});

test("Отсутствие скролла страници при открытом бургер-меню в мобильной версии", async({page}) => {
	await headerPage.burgerMenuBtn.tap();
	await expect(page.locator("#navbarScroll")).not.toHaveClass(/navbar_scrollable/);
});

test("Анимация изменения ширины поля ввода поиска при фокусе в мобильной версии", async({page}) => {
	await headerPage.closePopUps();
	await expect(page.locator(".search")).toHaveCSS("max-width", "100%");
	await page.mouse.wheel(0, 500);
	await page.waitForTimeout(1000);
	await expect(page.locator(".search")).not.toHaveCSS("max-width", "100%");
});

test("Отображение меню выбора города в мобильной версии", async() => {
	await headerPage.closePopUps();
	await headerPage.burgerMenuBtn.tap();
	await headerPage.headerCityLinkMobile.tap();
	await expect(headerPage.selectCity).toBeVisible();
});

test("Выбор города в мобильной версии", async({page}) => {
	await headerPage.closePopUps();
	await headerPage.burgerMenuBtn.tap();
	await headerPage.headerCityLinkMobile.tap();
	await page.locator("[data-slag-city='ussuriisk']").tap();
	await headerPage.burgerMenuBtn.tap();
	await expect(headerPage.headerCityLinkMobile).toContainText("Уссурийск");
});

test("Поиск города в мобильной версии", async({page}) => {
	await headerPage.closePopUps();
	await headerPage.burgerMenuBtn.tap();
	await headerPage.headerCityLinkMobile.tap();
	await headerPage.searchCityInput.fill("Хаба");
	await expect(page.locator("[data-slag-city='khabarovsk']")).toContainText("Хабаровск");
});

test("Отсутствие результата поиска города", async({page}) => {
	await headerPage.closePopUps();
	await headerPage.burgerMenuBtn.tap();
	await headerPage.headerCityLinkMobile.tap();
	await headerPage.searchCityInput.fill("Москва");
	await expect(headerPage.searchCityInput).toHaveClass("error");
	await expect(headerPage.notFoundCity).toContainText("Ничего не найдено. Попробуйте изменить запрос.");
});

test("Отображение попапа результатов поиска при количестве введенных символов больше двух", async({page}) => {
	await headerPage.closePopUps();
	await headerPage.headerSearch.fill("ана");
	await expect(headerPage.headerSearchResult).toHaveClass(/header__search-result_show/);
	await expect(headerPage.headerSearchResultItem.first()).toBeEnabled();
});

test("негативное Отображение попапа результатов поиска", async({page}) => {
	await headerPage.closePopUps();
	await headerPage.headerSearch.fill("fyf");
	await expect(headerPage.headerSearchResult).toHaveClass(/header__search-result_show/);
	await expect(page.locator(".search-result__no-result")).toBeVisible()
});

