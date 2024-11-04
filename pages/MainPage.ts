import { test, expect, Page, Locator } from '@playwright/test';


export class MainPage{
    readonly page                   : Page;
    readonly consentData            : Locator;
    readonly multiForm              : Locator;
    readonly webTable               : Locator;
    readonly searchFilter           : Locator;
    readonly scrollAble             : Locator;
    readonly uploadImage            : Locator;
    readonly registrationLogin      : Locator;
    readonly banking                : Locator;
    readonly simpleCalculator       : Locator;
    readonly ConsumptionCalcumlator : Locator;


    constructor (page: Page){
        this.page                   = page;
        this.consentData            = page.locator("//p[contains(.,'Consent')]");
        this.multiForm              = page.locator("a[href='/angularJs-protractor/Multiform']");
        this.webTable               = page.locator("a[href='/angularJs-protractor/WebTable']");
        this.searchFilter           = page.locator("//a[normalize-space()='SearchFilter']");
        this.scrollAble             = page.locator("a[href='/angularJs-protractor/Scrollable']");
        this.uploadImage            = page.locator("//a[normalize-space()='Upload Image']");
        this.registrationLogin      = page.locator("//a[normalize-space()='RegistrationLogin']");
        this.banking                = page.locator("//a[normalize-space()='Banking']");
        this.simpleCalculator       = page.locator("//a[normalize-space()='Simple Calculator']");
        this.ConsumptionCalcumlator = page.locator("//a[@class='button tiny_button button_pale regular_text'][normalize-space()='Consumption Calculator']");
    }

    async navigateToWebSite(url:string, pageTitle: string){
        await this.page.goto(url);
        expect(this.page).toHaveTitle(pageTitle);
        if (await this.consentData.isVisible()){
            await this.consentData.click();
        }
    }

    async goToMultiform(){
        await this.multiForm.click();
    }
    async goToWebTable(){
        await this.webTable.click();
    }
    async goToSearchFilter(){
        await this.searchFilter.click();
    }
    async goToScrollable(){
        await this.scrollAble.click();
    }
    async goToUploadImage(){
        await this.uploadImage.click();
    }
    async goToRegistrationLogin(){
        await this.registrationLogin.click();
    }
    async goToBanking(){
        await this.banking.click();
    }
    async goToSimpleCalculator(){
        await this.simpleCalculator.click();
    }
    async goToConsumptionCalculator(){
        await this.ConsumptionCalcumlator.click();
    }

}
