const Alexa = require('ask-sdk');
const {names} = require('details.js');

const imagePath = 'https://s3.amazonaws.com/alexaworkshop/movie_library.png';
const backgroundImagePath = `https://s3.amazonaws.com/alexaworkshop/movie_library.png`
//arn:aws:lambda:us-east-1:561687188293:function:MovieLibrary

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
     const speechText = 'Welcome to Movie Suggestions  ';
     const responseBuilder = handlerInput.responseBuilder;
     if (supportsDisplay(handlerInput)) {
        const image = new Alexa.ImageHelper()
                .addImageInstance(getLargeImage())
                .getImage(imagePath);
                const bgImage = new Alexa.ImageHelper()
                .addImageInstance(getBackgroundImage(800, 1200, backgroundImagePath))
                .getImage();
                const primaryText = new Alexa.RichTextContentHelper()
                .withPrimaryText(speechText)
                .getTextContent();
                responseBuilder.addRenderTemplateDirective({
                    type: `BodyTemplate6`,
                    backButton: 'HIDDEN',
                    backgroundImage: bgImage,
                    image,
                    textContent: primaryText,
                  });
    }
    
    return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }

};


const RegisterIntetnHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'SuggestMovieIntent';
    },
    handle(handlerInput) {
        console.log("into Register")
 
        let genreName = '';
        let name = '';
        let speechText = '';
        if (handlerInput.requestEnvelope.request.intent.slots.Genre
            && handlerInput.requestEnvelope.request.intent.slots.Genre.resolutions
            && handlerInput.requestEnvelope.request.intent.slots.Genre.resolutions.resolutionsPerAuthority[0]
            && handlerInput.requestEnvelope.request.intent.slots.Genre.resolutions.resolutionsPerAuthority[0].values
            && handlerInput.requestEnvelope.request.intent.slots.Genre.resolutions.resolutionsPerAuthority[0].values[0]
            && handlerInput.requestEnvelope.request.intent.slots.Genre.resolutions.resolutionsPerAuthority[0].values[0].value
            && handlerInput.requestEnvelope.request.intent.slots.Genre.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {

            genreName = handlerInput.requestEnvelope.request.intent.slots.Genre.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            console.log("nickName", genreName)
            name = names[genreName];
            console.log("name", name)
            speechText += `Hey, the movies for ${genreName} are ${name}. Do you want me to suggest anything else.?`


        } else{
            speechText += "Sorry i didn't get you. " 
        }
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }

};


const FallbackHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = `Sorry, this feature is not enabled on this skill.`
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};


const YesHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const speechText = `Ok, I'm listening what do you want to know?`
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};
const NoHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        const speechText = `Okay! Bye bye!`
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    },
};

// Error Handler
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speechText = `Sorry, I can't understand the command. Please say again.`
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};
// Help Intent
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {

        const speechText = `help`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withStandardCard('', speechText)
            .getResponse();
    }
};

// SessionEndedRequest
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

// Skill Builder
const skillBuilder = Alexa.SkillBuilders.standard();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterIntetnHandler,
        FallbackHandler,
        HelpIntentHandler,
        NoHandler,
        YesHandler,
        SessionEndedRequestHandler,
)
    .addErrorHandlers(ErrorHandler)
    .lambda();





function supportsDisplay(handlerInput) {
    const hasDisplay =
      handlerInput.requestEnvelope.context &&
      handlerInput.requestEnvelope.context.System &&
      handlerInput.requestEnvelope.context.System.device &&
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
    return hasDisplay;
  }
  function getLargeImage(stateAbbreviation) {
      return getImageUrl(800, 1200, stateAbbreviation);
    }
    function getBackgroundImage(height, width, stateAbbreviation) {
      return backgroundImagePath.replace('{H}', height)
        .replace('{W}', width)
        .replace('{A}', stateAbbreviation);
    }
    function getImageUrl(height, width, stateAbbreviation) {
      return imagePath.replace('{H}', height)
        .replace('{W}', width)
        .replace('{A}', stateAbbreviation);
    }


    function setBodyTemplate (handlerInput,responseBuilder,bodyTemplate,speechText,hide=`HIDDEN`){
            const image = new Alexa.ImageHelper()
                    .addImageInstance(getLargeImage())
                    .getImage(imagePath);
            const bgImage = new Alexa.ImageHelper()
                    .addImageInstance(getBackgroundImage(800, 1200, backgroundImagePath))
                    .getImage();
            const primaryText = new Alexa.RichTextContentHelper()
                    .withPrimaryText(speechText)
                    .getTextContent();
                    return {
                        type: bodyTemplate,
                        backButton:hide,
                        backgroundImage: bgImage,
                        image,
                        textContent: primaryText,
                    }
            
        
    }