const puppeteer = require("puppeteer");
const prompt = require("prompt-sync")({sigint: true}) ;
// const mvName = prompt('Which movie you want to download?');
const firstEpisodeLength = prompt('No. the First Episode you want to download ');
const lastepisodeLength = prompt('No. the Last Episode you want to download ');
// let mvName = "Flash TV" ;
// let mvName = "The good doctor" ;
// let mvName = "Arrow TV" ;
// let mvName = "Elite TV" ;
// let mvName = "Lucifer" ;
// let mvName = " Money Heist TV" ;
// let mvName = "vikings TV ";


let link ;
let tab ;
let allEpisodes ;

function seriesName(mvName)
{
    (async function(){
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
        });
    
        let pages = await browser.pages() ;
        tab = pages[0] ;
        await tab.goto("https://ytstv.me/") ;
        // await tab.mouse.wheel({ deltaY: 5000 });
        await tab.waitForSelector('input[type="text"]' , {visible:true}) ;
        await tab.click('input[type="text"]') ;
        await tab.type('input[type="text"]' , mvName) ;
        await tab.keyboard.press("Enter") ;
        await tab.waitForSelector(".ml-mask.jt" , {visible:true} ) ;
        await tab.click(".ml-mask.jt") ;
        
        console.log("Reach Here") ;
        await tab.waitForSelector(".tvseason" , {visible:true}) ;
        let allSeason = await tab.$$(".tvseason") ;
        console.log(allSeason.length) ;
    
        for(let i = 0 ; i < allSeason.length ; i++)
        {
            allEpisodes = await tab.$$(".les-content a") ;
        //     await tab.evaluate(function(elem){return elem.click() ;}, allEpisodes[i])
        //     console.log(allEpisodes.length) ;
        }
    
        link = await tab.url() ;
        console.log("Page URL  " + link) ;
        
        let allHref = [] ;
        for(let i = 0 ; i < allEpisodes.length ; i++)
        {
            let onelink = allEpisodes[i] ;
            let href = await tab.evaluate(function(elem){return elem.getAttribute("href") ;} , onelink) ;
            allHref.push(href); ;
        }
    
        console.log(allHref.length) ;
        console.log(allHref) ;
        // console.log(firstEpisodeLength - lastepisodeLength) ;
    
        // console.log(firstEpisodeLength , lastepisodeLength) ;
    
        for(let i = firstEpisodeLength ; i < lastepisodeLength ; i++)
        {
            let tl = allHref[i] ;
            let newTab = await browser.newPage() ;
            await newTab.goto(tl) ;
    
            let selector = await newTab.$$(".tab-pane.active .btn-group.btn-group-justified.embed-selector a") ;
            if(selector.length == 1)
            {
                await newTab.waitForSelector(".lnk-lnk.lnk-1" , {visible:true}) ;
                await newTab.click(".lnk-lnk.lnk-1") ;
                await newTab.waitForTimeout(2000) ;
            }
            else if(selector.length == 2)
            {
                await newTab.waitForSelector(".lnk-lnk.lnk-2" , {visible:true}) ;
                await newTab.click(".lnk-lnk.lnk-2") ;
                await newTab.waitForTimeout(2000) ;
            }
            else if(selector.length >= 3)
            {
                await newTab.waitForSelector(".lnk-lnk.lnk-3" , {visible:true}) ;
                await newTab.click(".lnk-lnk.lnk-3") ;
                await newTab.waitForTimeout(2000) ;
            }
            // else
            // {
    
            //     await newTab.waitForSelector(".lnk-lnk.lnk-3" , {visible:true}) ;
            //     await newTab.click(".lnk-lnk.lnk-3") ;
            //     // await newTab.waitForTimeout(2000) ;
            // }
            // await newTab.close() ;
        }
        await tab.bringToFront() ;
        let tabs = await browser.pages() ;
        console.log(tabs.length) ;
    
        for(let i = 1 ; i < tabs.length ; i++)
        {
            await tabs[i].close() ;
        }
    
    })() ;
}

module.exports = seriesName ;
