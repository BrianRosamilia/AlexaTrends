# Alexa `Trends`

## Ask Alexa what's trending (via google trends)

## Setup

### Intent Schema
```
{
  "intents": [
    {
     "intent": "getTrendsByCategory",
     "slots": [
        {
         "name": "category",
          "type": "TREND_CATEGORY"
        }]
    }
  ]
}
```

### Sample Utterances

```
getTrendsByCategory {category}
getTrendsByCategory in {category}
getTrendsByCategory trends in {category}
getTrendsByCategory latest {category}
getTrendsByCategory {category} latest
getTrendsByCategory to tell me about {category}
```

### Custom Slot (TREND_CATEGORY)

```
Business
Sports
Technology
Health
```

## Setup

Configuring the sample app is as easy as pasting the ARN of your Lambda function into `config/default.json` and running `npm install`. That's it! If you don't know how to get your ARN then read "Creating you Lambda function" below.

```
{
	"Amazon" : {
		"lambda-arn" : "YOUR ARN HERE",
	}
}
```

## Deploying to Amazon Lambda

`grunt` makes it easy to deploy code. Just run:

```
grunt deploy
```
