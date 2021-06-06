const puppeteer = require("puppeteer");
// let mvName = "John wick" ;
// let mvName = "The Notebook" ;
// let mvName = "Avengers: Infinity War" ;
// let mvName = "diary of wimpy kid" ;


let link ;
let tab ;

function movieN(mvName)
{
    (async function(){
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
        });

        let pages = await browser.pages() ;
        tab = pages[0] ;
        await tab.goto("https://themoviesflix.io/") ;
        await tab.type('input[type="search"]', mvName) ;
        await tab.keyboard.press("Enter") ;
        await tab.waitForSelector(".title.front-view-title a" , {visible: true});
        let allQuesArray = await tab.$$(".title.front-view-title a") ;
        let allPendingPromises = [] ;
        for(let i = 0 ; i < allQuesArray.length ; i++)
        {
            let oneATag = allQuesArray[i] ;
            let pendingPromise = oneATag.evaluate(function(element) {return element.getAttribute("href")} , oneATag) ;
            allPendingPromises.push(pendingPromise) ;
            break ;
        }
        let allPromisesCombinedData = await Promise.all(allPendingPromises) ;
        // console.log(allPromisesCombinedData) ; // gives the link 
        await tab.goto(allPromisesCombinedData[0]) ;
        let link = await tab.url() ;
        // console.log("Page URL  " + link) ;


        await tab.waitForTimeout(3000) ;

        let selector = await Promise.race([
            tab.$$('a[rel="noreferrer noopener"]'),
            tab.$$('a[rel="nofollow noopener"]')
        ]);

        // console.log(selector.length) ;
        if(selector.length == 0)
        {
                selector = await Promise.race([
                tab.$$('a[rel="nofollow noopener"]'),
                tab.$$('a[rel="noreferrer noopener"]')
            ]);
            // console.log("reached here") ;
            // console.log(selector) ;
            // console.log(selector.length) ;
        }

        // console.log(selector.length) ;
        tab.waitForTimeout(3000) ;

        for(let i = 0 ; i < selector.length ; i++)
        {
            if(i == 1)
            {
                let oneATag = selector[i] ;
                link = await tab.evaluate(function(elem){return elem.getAttribute("href")} , oneATag) ;
                console.log(link)  ;
                break ;
            }
            else{
                
                let oneATag = selector[0] ;
                link = await tab.evaluate(function(elem){return elem.getAttribute("href")} , oneATag) ;
                console.log(link)  ;
            }
        }


        await tab.goto(link) ;
        await tab.waitForTimeout(5000) ;

        let aTag = await tab.$('a[rel="nofollow noopener"]') ;
        href = await tab.evaluate(function(elem){return elem.getAttribute("href")} , aTag) ;
        console.log(href) ;
        await tab.goto(href) ;

        await tab.waitForSelector(".col-md-12.text-center .btn.btn-primary" , {visible:true}) ;
        await tab.click(".col-md-12.text-center .btn.btn-primary") ;


        let tabs = await browser.pages() ;
        // console.log(tabs.length) ;
        await tab.bringToFront() ;

        await tab.waitForTimeout(1000) ;
        for(let i = 1 ; i < tabs.length ; i++)
        {
            let pagetoClose = tabs[i] ;
            await pagetoClose.close() ;
        }

        await tab.waitForTimeout(6000) ;
        await tab.waitForSelector("#status .go_button" , {visible:true}) ;
        await tab.click("#status .go_button") ;

    })() ;

}


module.exports = movieN ;




