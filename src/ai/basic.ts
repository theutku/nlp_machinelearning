class BasicInteractionIdentifier {
    botRelatedKeywords: [string];
    speakerRelatedKeywords: [string];

    questions: [string];
    credentials: [string];

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

    constructor() {
        this.initBasicBot();
        this.initBasicSpeaker();
        this.initQuestions();
        this.initCredentials();
    }
}

export default new BasicInteractionIdentifier();