const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Uncomment the following lines to loan the environment 
variables that you set up in the .env file*/

 const dotenv = require('dotenv');
 dotenv.config();

 const api_key = process.env.API_KEY;
 const api_url = process.env.API_URL;

function getNLUInstance() {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator ({
            apikey: api_key
        }),
        serviceUrl: api_url
    });
    return naturalLanguageUnderstanding;
}

function urlNLU (urlToAnalyze,operationNLU) {
   
    const analyzeParams = 
    {
        "url": urlToAnalyze,
        "features": {
            "keywords": {
                [operationNLU]: true,
                "limit": 1
            }
        }
    }
    
    const naturalLanguageUnderstanding = getNLUInstance();
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        //Retrieve the sentiment and return it as a formatted string

        return res.send(analysisResults.result.keywords[0][operationNLU],null,2);
    })
    .catch(err => {
        return res.send("Could not do desired operation "+err);
    });
}



//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req,res) => {
     //Extract the url passed from the client through the request object
     let urlToAnalyze = req.query.url;
     return urlNLU(urlToAnalyze , emotion);
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req,res) => {
    return urlNLU(urlToAnalyze , sentiment);
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req,res) => {
    return urlNLU(urlToAnalyze , emotion);
});

app.get("/text/sentiment", (req,res) => {
    return urlNLU(urlToAnalyze , sentiment);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

