import fetch from "node-fetch";
import cheerio from 'cheerio';

commandExecutor(process.argv[2]);

function commandExecutor(cmd: string){
    if(cmd.startsWith("amazon")){
        const productASIN = cmd.split(':')[1];
        checkAmazonProductAvailability(productASIN);
    }
}

function checkAmazonProductAvailability(productASIN: string){
    const searchAmazonProductByAsinUrl = `https://www.amazon.es/exec/obidos/ASIN/${productASIN}`;
    fetch(searchAmazonProductByAsinUrl)
    .then(response =>response.text())
    .then(html => {
      const $ = cheerio.load(html);
      const availabilityDomElement: cheerio.Cheerio = $('#availability > span[class*="a-color-success"]');
      availabilityDomElement.length === 1 ? successExit() : errorExit();
    })
    .catch(e => errorExit());
}

function successExit(){
    console.log("{in-stock: true}");
}

function errorExit(){
    console.log("{in-stock: false}");
}