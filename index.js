"use strict";
let alexa = require('alexa-app');
let app = new alexa.app();
let promise = require('bluebird');
let requestify = require('requestify');

promise.config({
    longStackTraces: false,
    warnings: false
});
let config = require('config').get('Amazon');

app.launch(function (request, response) {
    response.say('<speak>Here are the current trending topics<break time="1s"/>');

    ProcessRequest('all', response);

    return false;
});

app.intent('getTrendsByCategory',
    {},
    function (request, response) {
        var category = request.slot('category');
        let categoryParam = mapCategoryToParam(category);

        if (categoryParam == 'help') {
            response.say('<speak>Try asking latest trends about technology, business, health, or sports.  Or you can just say "alexa <break time="200ms"/>latest trends');
            return renderResponse(response);
        }
        response.say(`<speak>Trending in ${category}<break time="1s"/>`);

        ProcessRequest(categoryParam, response);

        return false;
    }
);

app.error = function (exception, request, response) {
    console.log('Alex global error handler', exception);
    response.say('Sorry, something bad happened');
    renderResponse(response);
};

function ProcessRequest(categoryParam, awsResponse) {
    return requestify.get(`https://www.google.com/trends/api/stories/latest?hl=en-US&cat=${categoryParam}&fi=15&fs=15&geo=US&ri=300&rs=8&sort=0&tz=240`).then(function (response) {
        var responseText = spliceSlice(response.getBody(), 0, 4);
        var responseJSON = JSON.parse(responseText);
        let listOfTrends = responseJSON.storySummaries.trendingStories.map(function (x) {
            return x.title.split(',')[0]
        });

        listOfTrends.splice(listOfTrends.length - 1, 0, 'and <break time="300ms"/>');
        console.log('Speaking', listOfTrends);
        awsResponse.say(listOfTrends);
    }).catch(function (e) {
        console.log(e);
        awsResponse.say('Sorry, something bad happened while getting trends');
        renderResponse(awsResponse);
    }).finally(function () {
        renderResponse(awsResponse);
    });
}

function renderResponse(awsResponse) {
    awsResponse.say('</speak>');
    awsResponse.response.response.outputSpeech.type = 'SSML';
    awsResponse.response.response.outputSpeech.ssml = awsResponse.response.response.outputSpeech.text;
    awsResponse.send();
}

function mapCategoryToParam(word) {
    switch (word.toLowerCase()) {
        case 'technology' :
            return 't';
        case 'business' :
            return 'b';
        case 'health' :
            return 'm';
        case 'sports' :
            return 's';
        default :
            return 'help';
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
