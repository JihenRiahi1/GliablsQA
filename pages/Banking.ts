import { expect, Page, Locator } from '@playwright/test'
import * as data from "../datas/BankingPage.json"


export class Banking{

    readonly page                   : Page
    readonly bankName               : Locator
    readonly home                   : Locator
    readonly customerLogin          : Locator
    readonly bankManagementLogin    : Locator
    readonly addCustomer            : Locator
    readonly openAccount            : Locator
    readonly customers              : Locator
    readonly inputFirstName         : Locator
    readonly inputLastName          : Locator
    readonly inputPostCode          : Locator
    readonly submit                 : Locator
    readonly selectCustomerName     : Locator
    readonly selectCurrency         : Locator
    readonly searchCustomer         : Locator
    readonly customersInfo          : Locator
    readonly deleteCustomerButton   : Locator
    constructor (page: Page){
        this.page                  = page
        this.bankName              = page.locator("//strong[@class='mainHeading']")
        this.home                  = page.locator("//button[normalize-space()='Home']")
        this.customerLogin         = page.locator("//button[normalize-space()='Customer Login']")
        this.bankManagementLogin   = page.locator("//button[normalize-space()='Bank Manager Login']")
        this.addCustomer           = page.locator("//div/button[contains(text(),'Add Customer')]")
        this.openAccount           = page.locator("//button[contains(text(),'Open Account')]")
        this.customers             = page.locator("//button[contains(text(),'Customers')]")
        this.inputFirstName        = page.locator("input[placeholder='First Name']")
        this.inputLastName         = page.locator("input[placeholder='Last Name']")
        this.inputPostCode         = page.locator("input[placeholder='Post Code']")
        this.submit                = page.locator("button[type='submit']")
        this.selectCustomerName    = page.locator("#userSelect")
        this.selectCurrency        = page.locator("#currency")
        this.searchCustomer        = page.locator("//input[@placeholder='Search Customer']")
        this.customersInfo         = page.locator("//tbody/tr/td")
        this.deleteCustomerButton  = page.locator("//button[normalize-space()='Delete']")
    }

    private lastAlertMessage: string | null = null;
    public createdAccountNumber

    async homePageElements(){
        expect(await this.bankName.innerText()).toBe(data.banCurrentkName)
        expect(await this.home.innerText()).toBe(data.homeName)
        expect(await this.customerLogin.innerText()).toBe(data.customerLogin)
        expect(await this.bankManagementLogin.innerText()).toBe(data.bankManagerLogin)
        await this.checkColor(this.customerLogin,data.customerLoginStyle)
        await this.checkColor(this.bankManagementLogin,data.bankManagerLoginStyle)
//the color is different in other browsers
        //await this.checkColor(this.home,data.homeStyle)
    }
    
    async bankMangment(){
        await this.bankManagementLogin.click()
//the color is different in other browsers
        //await this.checkColor(this.addCustomer,data.inactivebuttonStyle)
        //await this.checkColor(this.openAccount,data.inactivebuttonStyle)
        //await this.checkColor(this.customers,data.inactivebuttonStyle)

    }

    async addCustomers(name: string, lastName: string, postCode: string){
        await this.addCustomer.click()
        await this.inputFirstName.fill(name)
        await this.inputLastName.fill(lastName)
        await this.inputPostCode.fill(postCode)
        await this.alertaHandling()
        await this.submit.click()
// we check here the place holder text
        await this.InputplaceHolderText(this.inputFirstName,data.inputFirstName)
        await this.InputplaceHolderText(this.inputLastName,data.inputLastName)
        await this.InputplaceHolderText(this.inputPostCode,data.inputPostCode)
// we check here the collor of the current clicked button 
        await this.checkColor(this.addCustomer,data.activebuttonStyle)
    }

    async openAccounts(){
        await this.openAccount.click()
        await this.selectCustomerName.selectOption({label : data.customerFirstName+" "+data.customerLastName})
        await this.selectCurrency.selectOption("Dollar")
        await this.alertaHandling()
        await this.submit.click()
        await this.checkAlertMessege(data.createdAccountAlert)
        const splitted = this.lastAlertMessage?.split(":",2)
        this.createdAccountNumber = splitted?.[1]   
    }

    async checkExistingCustomer(name: string , lastName: string , postCode: string, accountNumber :string ){
        await this.customers.click()
        await this.searchCustomer.fill(name)
        const result = await this.customersInfo.allInnerTexts()
        let customerdetails : string[]=[name,lastName,postCode,accountNumber]
        console.log("customer details: "+customerdetails)
        var index
        for(index in customerdetails){
            console.log(customerdetails[index])
            expect(result).toContain(customerdetails[index])
        }
    }

    async deleteCustomer(name: string){
        await this.customers.click()
        await this.searchCustomer.fill(name)
        await this.deleteCustomerButton.click()
        expect(this.customersInfo).not.toBeVisible()
    }

    async checkColor(element, color){
        const currentColor = await element.evaluate(el => {
            const computedStyle = window.getComputedStyle(el)
            return {"color": computedStyle.color,"backgroundColor" : computedStyle.backgroundColor,"borderColor": computedStyle.borderColor} 
          })
/*           console.log("current color: ")
          console.log(currentColor)
          console.log("expected color: ")
          console.log(color) */
          expect(currentColor).toEqual(color)     
    }

    async alertaHandling(){
        this.page.once('dialog', async(alert) =>{
            const alertText = alert.message()
            await alert.accept()
            this.lastAlertMessage = alertText;
        })
    }

    async InputplaceHolderText(element: Locator, text: String){
        expect(await element.getAttribute("placeholder")).toBe(text)
    }

    async checkAlertMessege(expectedAlert){
        const index = this.lastAlertMessage?.indexOf(":")
        if ( index >= 0 ){
            const splitted = this.lastAlertMessage?.split(":",2)
            const currentMessege = splitted?.[0]
            expect(currentMessege).toBe(expectedAlert)
        }
        else{
            expect(this.lastAlertMessage).toBe(expectedAlert)
        }
        
    }
}