const puppeteer = require("puppeteer");
const sendLink = require("./imdb") ;
const prompt = require("prompt-sync")({sigint: true}) ;
const mvName = prompt('Which movie you want to download?');

let href ;

(async function(){
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    });

    let pages = await browser.pages() ;
    let tab = pages[0] ;
    await tab.goto("https://www.imdb.com/");
    await tab.type('input[type="text"]' , mvName) ;
    await tab.waitForTimeout(1000) 
    // await tab.keyboard.press("ArrowDown");
    await tab.keyboard.press("Enter")
    // let link = await tab.url() ;
    // console.log("Page URL  " + link) ;
    await tab.waitForSelector('.findList tr.findResult.odd .primary_photo a' , {visible : true}) ;
    let allATag = await tab.$('.findList tr.findResult.odd .primary_photo a') ;
    // console.log(allATags) ;
    
    let oneATag = allATag ;
    href = await tab.evaluate(function(elem){return elem.getAttribute("href")} , oneATag) ;
    href = "https://www.imdb.com" + href ;
    console.log(href) ;
    await tab.goto(href) ;
    await browser.close() ;
    await tab.waitForTimeout(3000) ;
    await sendLink(href , mvName) ;    



})() ;

