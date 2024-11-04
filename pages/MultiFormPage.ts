import { test, expect, Page, Locator } from '@playwright/test';
import * as data from "../datas/MultiformPage.json"



export class MultiFormPage{
    readonly page                   : Page;
    readonly nameInput              : Locator;
    readonly emailInput             : Locator;
    readonly nextSection            : Locator;
    readonly consoleQuestion        : Locator;
    readonly radioButton            : Locator;
    readonly paymentMessage         : Locator;
    readonly submitButton           : Locator;
    readonly typedData              : Locator;

    constructor (page: Page){
        this.page                  = page;
        this.nameInput             = page.locator("//input[@name='name']");
        this.emailInput            = page.locator("//input[@name='email']");
        this.nextSection           = page.locator("//a[normalize-space()='Next Section']");
        this.consoleQuestion       = page.locator("label[class='ng-scope']");
        this.radioButton           = page.locator("//div[@class='radio']/label");
        this.paymentMessage        = page.locator("//h3[normalize-space()='Thanks For Your Money!']");
        this.submitButton          = page.locator("button[type='submit']");
        this.typedData             = page.locator("//pre[@class='ng-binding']")
   
    }

    
    async creatProfile(name: string, email: string, gameConsole: string){
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.nextSection.click();
        const questionABoutConsole = await this.consoleQuestion.textContent()
        console.log("the question is"+ questionABoutConsole)
        expect(questionABoutConsole).toBe(data.questionConsole)
        const consolsList = await this.radioButton.allTextContents();
        let gameConsoleName = ""
        for (let index=0; index < consolsList.length; index++){
            const currentRadio = await this.radioButton.nth(index).textContent()
            console.log(currentRadio?.trim())
            if (currentRadio?.trim() == gameConsole){
                await this.radioButton.nth(index).click()
                console.log("click : "+currentRadio?.trim())
                let gameConsoleName = await this.radioButton.nth(index).inputValue()
                console.log(gameConsoleName)
            }
        }
        await this.nextSection.click();
        const paymentThanks = await this.paymentMessage.textContent()
        console.log("the payment thanks is: "+ paymentThanks)
        expect(paymentThanks).toBe(data.paymentThanksMessage)
        await this.alertaHandling(data.alertMessage)
        await this.submitButton.click()
        const selectedData = await this.typedData.textContent()
        console.log(selectedData)
        expect(selectedData).toContain(name)
        expect(selectedData).toContain(email)
        expect(selectedData).toContain(gameConsoleName)
    }
    async alertaHandling(alerMessage: string){
        this.page.on('dialog', async(alert) =>{
            const errorMessage = alert.message();
            await alert.accept();
            console.log("alert message: "+errorMessage);
            expect(errorMessage).toBe(alerMessage)
        })
    }

}
