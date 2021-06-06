const fs = require("fs") ;
const cheerio = require("cheerio") ;
const request = require("request") ;
// const movieN = require("./moviedownloader");
const movieN = require("./movieMainFile.js");
const seriesName = require("./ytsSeries.js");

// let imdbLink = "https://www.imdb.com/title/tt2582846/?ref_=nv_sr_srsg_0" ;
// let imdbLink = "https://www.imdb.com/title/tt4154756/?ref_=nv_sr_srsg_0" ;
// let imdbLink = "https://www.imdb.com/title/tt0088247/?ref_=nv_sr_srsg_0" ;
// let imdbLink = "https://www.imdb.com/title/tt4052886/?ref_=nv_sr_srsg_0" ;
// let imdbLink = "https://www.imdb.com/title/tt7134908/?ref_=nv_sr_srsg_0" ;
// let imdbLink = "https://www.imdb.com/title/tt2193021/?ref_=nv_sr_srsg_0" ;
// let imdbLink = "https://www.imdb.com/title/tt4425200/?ref_=fn_al_tt_1" ;
// let imdbLink = href ;

let SNname ;
function sendLink(imdbLink , mvName){
    SNname = mvName ;
    request(imdbLink , function(err , resp , data)
    {
        processData(data) ; 
    })
}

function processData(html)
{
    let myDocument = cheerio.load(html + "");

    let titleBar = myDocument(".title_bar_wrapper") ;
    let title = myDocument(".title_wrapper h1") ;
    let Rating = myDocument(".ratingValue")
    let movieOrSeries = myDocument(".subtext").text() ;
    let titleText = title.text() ;
    let ratingText = Rating.text() ;
    console.log(title.text()) ; // gives Proper title
    console.log(Rating.text()) ; // gives rating 
    movieOrSeries = movieOrSeries.split("|");
    // console.log(movieOrSeries.length) ;
    for(let i = 0 ; i < movieOrSeries.length ;i++)
    {
        if(i == movieOrSeries.length - 1)
        {
            // let mo = movieOrSeries[i] ;
            // console.log(mo.text()) ;
            console.log(movieOrSeries[i]) ; // tells if it is a movie or a series
            if(movieOrSeries[i].includes("TV Series")) 
            {
                let seiresN = SNname + " TV" ;
                seriesName(seiresN) ;
            }
            else{
                movieN(titleText) ;
            }
        }
    }


    // console.log(titleText) ;
    // processDetails(titleText , ratingText , movieOrSeries) ;

}

module.exports = sendLink ;











// function checkMovieFolder() 
// {
    
//     let teamFolderPath = `./movie` ;
//     return fs.existsSync(teamFolderPath) ;
// }

// function createFolder()
// {
//     let movieFolderPath = `./movie` ;
//     fs.mkdirSync(movieFolderPath) ;
// }

// function createFile(title , rating , movieOrSeries)
// {
//     let movieNameFolderPath = `./movie/mov.json` ;

//     let movieFile = [] ;
//     let data = {
//         Name : title , 
//         Rating : rating ,
//         Type : movieOrSeries 
//     }
//     movieFile.push(data) ;
//     fs.writeFileSync(movieNameFolderPath , JSON.stringify(movieFile)) ;
// }

// function updateFile(title , rating , movieOrSeries)
// {
//     let movieNameFolderPath = `./movie/mov.json` ;

//     let movieFile = JSON.parse(fs.readFileSync(movieNameFolderPath)) ;
//     let data = {
//         Name : title , 
//         Rating : rating ,
//         Type : movieOrSeries 
//     }
//     movieFile.push(data) ;
//     fs.appendFileSync(movieNameFolderPath , JSON.stringify(movieFile)) ;
// }



// function processDetails(titleText , ratingText , movieOrSeries)
// {
//     let isMovieFolder = checkMovieFolder() ;
//     if(isMovieFolder)
//     {
//         let updateMovieFile = updateFile(titleText ,ratingText, movieOrSeries) ;
//     }
//     else{
//         let createMovieFolder = createFolder() ;
//         let createMovieFile = createFile(titleText ,ratingText, movieOrSeries) ;
//     }


// }

