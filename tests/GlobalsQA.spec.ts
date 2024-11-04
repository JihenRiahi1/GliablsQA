import { test, expect ,Page} from '@playwright/test'
import * as data from "../datas/MainPage.json"
import * as dataMultiForm from "../datas/MultiformPage.json"
import * as dataBanking from "../datas/BankingPage.json"
import { MainPage } from '../pages/MainPage'
import {MultiFormPage} from '../pages/MultiFormPage'
import {Banking} from '../pages/Banking'
import { DatabaseSync } from 'node:sqlite'

let page: Page
let mainPage: MainPage
let multiFormPage : MultiFormPage
let banking : Banking

test.beforeEach(async ({browser}) =>{
  page = await  browser.newPage()
  mainPage = new MainPage(page)
  multiFormPage = new MultiFormPage(page)
  banking = new Banking(page)
  await mainPage.navigateToWebSite(data.baseUrl,data.pageTitle)
})

test.describe("playwrite testing exemple",()=>{

  test("Multiform", async ({}) => {
    await mainPage.goToMultiform()
    await multiFormPage.creatProfile(dataMultiForm.name, dataMultiForm.email,dataMultiForm.PS4Choice)
  })

  test("Banking Happy Path Customer creation and delete", async({}) => {
    await mainPage.goToBanking()
    await banking.homePageElements()
    await banking.bankMangment()
    await banking.addCustomers(dataBanking.customerFirstName,dataBanking.customerLastName,dataBanking.customerPostCode)
    await banking.checkAlertMessege(dataBanking.createdCustomerALert)
    await banking.openAccounts()
    await banking.checkExistingCustomer(dataBanking.customerFirstName,dataBanking.customerLastName,dataBanking.customerPostCode, banking.createdAccountNumber)
    await banking.deleteCustomer(dataBanking.customerFirstName)
  })

  test("Customer Dublication", async({})=>{
    await mainPage.goToBanking()
    await banking.homePageElements()
    await banking.bankMangment()
    await banking.addCustomers(dataBanking.customerFirstName,dataBanking.customerLastName,dataBanking.customerPostCode)
    await banking.checkAlertMessege(dataBanking.createdCustomerALert)
    await banking.addCustomers(dataBanking.customerFirstName,dataBanking.customerLastName,dataBanking.customerPostCode)
    await banking.checkAlertMessege(dataBanking.customerDublicationAlert)
    await banking.deleteCustomer(dataBanking.customerFirstName)
  })

})