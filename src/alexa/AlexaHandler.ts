declare var Alexa: any;


class AlexaHandler {
    constructor() {
        initAlexa();
    }
}

function initAlexa() {
    const alexa = new Alexa({ version: "0.2" });
    alexa.onReady((message: string) => {
        alert('startup succeeded, time to start my game');
    });

    alexa.onReadyFailed((message: string) => {
        alert('startup failed, better message customer');
    });

    alexa.skill.onMessage((message: string) => {
        // This is invoked for every HandleMessage directive from the skill.
        alert('received a message: ' + message);
    });
}