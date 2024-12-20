import {type Page, type Locator} from "@playwright/test";
import { HeaderPage } from "./header.page";

export class AddressPage extends HeaderPage {
	protected page: Page;
	addressesBtnReview: Locator;
	visitorDate: Locator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.addressesBtnReview = page.locator(".addresses__btn-review");
		this.visitorDate = page.locator("#id_visitor_date");
	}

	async clickRandomAddresses() {
		const addressesCount = await this.addressesBtnReview.count();
		const randomIndex = Math.floor(Math.random() * addressesCount);
		const randomBtn = this.addressesBtnReview.nth(randomIndex);
		await randomBtn.click();
	};

	async todayDate() {
		const today = new Date();
		const formattedDate = today.toISOString().split("T")[0];
		await this.visitorDate.fill(formattedDate);
	};
}