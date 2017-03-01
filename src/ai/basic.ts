class BasicInteractionIdentifier {
    botRelatedKeywords: [string];
    speakerRelatedKeywords: [string];

    questions: [string];
    credentials: [string];
    greetings: [string];

    initBasicBot() {
        this.botRelatedKeywords = ['your', 'you', 'yours', 'yourself']
    }

    initBasicSpeaker() {
        this.speakerRelatedKeywords = ['me', 'mine', 'myself', 'my'];
    }

    initQuestions() {
        this.questions = ['what', 'who', 'how', 'where', 'when', 'which']
    }

    initCredentials() {
        this.credentials = ['age', 'name', 'sex', 'born', 'birthplace', 'male', 'female'];
    }

    initGreetings() {
        this.greetings = ['hello', 'hi', 'sup', 'hey'];
    }

    constructor() {
        this.initBasicBot();
        this.initBasicSpeaker();
        this.initQuestions();
        this.initCredentials();
        this.initGreetings();
    }
}

export default new BasicInteractionIdentifier();