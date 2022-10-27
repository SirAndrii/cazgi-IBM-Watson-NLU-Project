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

async function urlNLU ( dataType,data,operationNLU) {
   
    const analyzeParams = 
    {
        [dataType]: data,
        "features": {
            "keywords": {
                [operationNLU]: true,
                "limit": 1
            }
        }
    }
    
    const naturalLanguageUnderstanding = getNLUInstance();
    
   return naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        //Retrieve the sentiment and return it as a formatted string
       console.log( analysisResults.result.keywords[0][operationNLU] )
        return analysisResults.result.keywords[0][operationNLU];
    })
    .catch(err => {
        return ("Could not do desired operation "+err);
    });
}



//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", async (req,res) => {
     //Extract the url passed from the client through the request object
     const dataType = 'url'
    const data =  req.query[dataType]
    const NLU = 'emotion'
    const response = await urlNLU( dataType, data, NLU); 

    return res.send( response );
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", async(req,res) => {
    const dataType = 'url'
    const data =  req.query[dataType]
    const NLU = 'sentiment'
    const response = await urlNLU( dataType, data, NLU); 

    return res.send( response );
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", async (req,res) => {
    const dataType = 'text'
    const data =  req.query[dataType]
    const NLU = 'emotion'
    const response = await urlNLU( dataType, data, NLU); 
 
    return res.send( response );
});

app.get("/text/sentiment", async (req,res) => {
    const dataType = 'text'
    const data =  req.query[dataType]
    const NLU = 'sentiment'
    const response = await urlNLU( dataType, data, NLU); 

    return res.send( response );

});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

