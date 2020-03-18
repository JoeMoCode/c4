/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const START_GAME_PROMPT = "Joe, would you like to start the game? ";
const WELCOME_MESSAGE = "Welcome to the connect four game. I do not think you can beat me, mere mortal human, for I am a powerful A.I.. ";
const MOVE_MESSAGE_NO_SLOT = "Hmm. I had a problem understanding that move. ";
const START_GAME_MESSAGE = "Starting the game now. ";
const MOVE_REPROMPT = "You can select columns one through seven. Which column do you want? ";
const GOODBYE_MESSAGE = "Okay, come back, soon! ";
const TOO_SCARED_MESSAGE = "Oh, you must be too scared to challenge me. Come back when you are up to the challenge. ";
const HELP_MESSAGE = "The goal of the game is to get 4 pieces of your color in a row. You can tap a column on the screen or simply say the column you want to move in. ";
const HELP_MESSAGE_REPROMPT = "Which column would you like to move in? ";
const ERROR_PROMPT = MOVE_REPROMPT;
const ERROR_MESSAGE = "There was a problem with that. " + ERROR_PROMPT;
const APL_VISUAL_START_MSG = "APL Visuals are not yet supported. ";
const APL_VISUAL_REPROMPT_MSG = "Do you really want to play against me with APL visuals? ";
const NO_VISUAL_START_MSG = "This game is not playable without visuals right now. Goodbye. ";
const NO_VISUAL_REPROMPT_MSG = "";

const START_GAME_KEY = "startQ";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = WELCOME_MESSAGE + START_GAME_PROMPT;
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        sessionAttributes[START_GAME_KEY] = 1;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(START_GAME_PROMPT)
            .getResponse();
    }
};

const MoveIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MoveIntent';
    },
    handle(handlerInput) {
        //TODO get the slots and resolve to a value.
        console.log("Slot ordinal: "  + JSON.stringify(Alexa.getSlot(handlerInput.requestEnvelope, "ordinal")));
        console.log("Slot number: "  + JSON.stringify(Alexa.getSlot(handlerInput.requestEnvelope, "number")));

        const column = 1;
        const speakOutput = `Okay, moving to column ${column}` + MOVE_REPROMPT;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(MOVE_REPROMPT)
            .getResponse();
    }
};

const NoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(TOO_SCARED_MESSAGE)
            .getResponse();
    }
}

const StartGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartGameIntent' 
            || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'); // TODO add some logic to check question.
    },
    handle(handlerInput) {
        const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);

        if(supportedInterfaces["Alexa.Presentation.HTML"]) {
            const websiteLink = "https://connect-4-alexa.s3.amazonaws.com/webapp/index.html" + genRandomQueryParam();
            console.log("Trying to open: " + websiteLink);
            return handlerInput.responseBuilder
                .addDirective({
                    type: "Alexa.Presentation.HTML.Start",
                    data: {
                        mySsml: "<speak>Hello</speak>"
                    },
                    request: {
                        uri: websiteLink,
                        method: "GET"
                    },
                    transformers: [
                        {
                            inputPath: "mySsml",
                            transformer: "ssmlToSpeech",
                            outputName: "myTransformedSsml"
                        }
                    ],
                    configuration: {
                        timeoutInSeconds: 300
                    }
                })
                // .speak(START_GAME_MESSAGE)
                .shouldEndSession(false)
                .getResponse();
        } else if(supportedInterfaces["Alexa.Presentation.APL"]) {
            //TODO APL Visuals.
            return handlerInput.responseBuilder
                .speak(APL_VISUAL_START_MSG + APL_VISUAL_REPROMPT_MSG)
                .reprompt(APL_VISUAL_REPROMPT_MSG)
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(NO_VISUAL_START_MSG + NO_VISUAL_REPROMPT_MSG)
                // .reprompt(NO_VISUAL_REPROMPT_MSG)
                .getResponse();
        }
    }
}

function genRandomQueryParam() {
    return "?rand=" + Math.floor(Math.random() * 10000);
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE + HELP_MESSAGE_REPROMPT)
            .reprompt(HELP_MESSAGE_REPROMPT)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = GOODBYE_MESSAGE;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Sorry, I don\'t know about that. Please try again.")
            .reprompt("Sorry, I don\'t know about that. Please try again.")
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled stringified: ${JSON.stringify(error)}`);
        console.log(`~~~~ Error stack: ${error.stack}`);

        return handlerInput.responseBuilder
            .speak(ERROR_MESSAGE)
            .reprompt(ERROR_PROMPT)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        MoveIntentHandler,
        StartGameIntentHandler,
        NoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .withCustomUserAgent('joe-is-the-greatest')
    .lambda();
