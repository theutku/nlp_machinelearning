import basicIdentifier from './basic';
import * as botbuilder from 'botbuilder';
import botCredentials from '../credentials/bot';
import * as moment from 'moment';

class BasicInteraction {

    questionClassifier(message: botbuilder.IMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            var question: string;
            var target: string;
            var credential: string;
            console.log(message.text);
            for (var i = 0; i < basicIdentifier.greetings.length; i++) {
                if (message.text.includes(basicIdentifier.greetings[i])) {
                    resolve(`Hello! I am ${botCredentials.name}`);
                    break;
                }
            }

            for (var j = 0; j < basicIdentifier.questions.length; j++) {
                if (message.text.includes(basicIdentifier.questions[j])) {
                    question = basicIdentifier.questions[j];
                    break;
                }
            }

            for (var k = 0; k < basicIdentifier.botRelatedKeywords.length; k++) {
                if (message.text.includes(basicIdentifier.botRelatedKeywords[k])) {
                    target = 'bot';
                    break;
                } else if (message.text.includes(basicIdentifier.speakerRelatedKeywords[k])) {
                    target = 'user';
                    break;
                } else {
                    target = 'none';
                }
            }

            for (var l = 0; l < basicIdentifier.botRelatedKeywords.length; l++) {
                if (message.text.includes(basicIdentifier.credentials[l])) {
                    credential = basicIdentifier.credentials[l];
                    break;
                }
            }

            if (target == 'bot' || credential.length) {
                this.botCredentialQuestion(question, message).then((credentialAnswer) => {
                    resolve(credentialAnswer);
                    return;
                }).catch(() => {
                    reject('I could not understand that.');
                    return;
                })
            }

            if (target == 'none') {
                this.dailyQuestion(question, message).then((dailyAnswer) => {
                    resolve(dailyAnswer);
                    return;
                }).catch(() => {
                    reject('I could not understand that.');
                    return;
                })
            }

        })
    }

    private botCredentialQuestion(question: string, message: botbuilder.IMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            if (message.text.includes('old') || message.text.includes('age')) {
                resolve(botCredentials.age);
            } else if (message.text.includes('name') || message.text.includes('who')) {
                resolve(botCredentials.name);
            } else if (question == 'when' || message.text.includes('born')) {
                resolve(botCredentials.born);
            } else if (question == 'where' || message.text.includes('born')) {
                resolve(botCredentials.birthplace);
            } else {
                reject();
            }
        })

    }

    private dailyQuestion(question: string, message: botbuilder.IMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            if (question == 'what' && message.text.includes('time')) {
                var time = moment.utc().format('HH:mm:ss');
                resolve(time);
            } else if (question == 'what' && message.text.includes('day')) {
                var day = moment.utc().get('day');
                resolve(day);
            } else {
                reject()
            }
        })
    }

}

export default new BasicInteraction();