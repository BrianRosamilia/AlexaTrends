"use strict";
let alexa = require('alexa-app');
let app = new alexa.app();
let requestify = require('requestify');

app.launch(function (request, response) {
    //response.say('<speak>Here are todays trending topics <break time="5s"/></speak>');
    response.say('<speak>Here are todays trending topics<break time="1s"/>');

    ProcessRequest('all', response);

    return false;
});

app.intent('getTrendsByCategory',
    {},
    function (request, response) {
        var category = request.slot('category');

        console.log(typeof response.response.response.outputSpeech);
        response.say(`<speak>Trending in ${category}<break time="1s"/>`);

        ProcessRequest(category, response);

        return false;
    }
);

app.error = function (exception, request, response) {
    response.say('Sorry, something bad happened');
};

function ProcessRequest(category, awsResponse) {
    let categoryParam = mapCategoryToParam(category);

    requestify.get(`https://www.google.com/trends/api/stories/latest?hl=en-US&cat=${categoryParam}&fi=15&fs=15&geo=US&ri=300&rs=8&sort=0&tz=240`).then(function (response) {
        // Get the response body
        var responseText = spliceSlice(response.getBody(), 0, 4);
        var responseJSON = JSON.parse(responseText);
        let updateSpeech = responseJSON.storySummaries.trendingStories.map(function (x) {
            return x.title.split(',')[0]
        });

        updateSpeech.splice(updateSpeech.length-1, 0, 'and <break time="500ms"/>');
        console.log('Speaking', updateSpeech);
        awsResponse.say(updateSpeech);
    }).catch(function (e) {
        console.log(e);
        awsResponse.say('Sorry, something bad happened');
    }).finally(function(){
        awsResponse.say('</speak>');
        awsResponse.response.response.outputSpeech.type = 'SSML';
        awsResponse.response.response.outputSpeech.ssml = awsResponse.response.response.outputSpeech.text;

        awsResponse.send();
    });
}

function mapCategoryToParam(word){
    switch(word.toLowerCase()){
        case 'technology' :
            return 't';
        case 'business' :
            return 'b';
        case 'health' :
            return 'm';
        case 'sports' :
            return 's';
        default :
            return 'all';
    }
}

function spliceSlice(str, index, count, add) {
    if (index < 0) {
        index = str.length + index;
        if (index < 0) {
            index = 0;
        }
    }

    return str.slice(0, index) + (add || "") + str.slice(index + count);
}

exports.handler = app.lambda();
