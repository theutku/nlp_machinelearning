import basicIdentifier from './basic';
import * as botbuilder from 'botbuilder';
import botCredentials from '../credentials/bot';
import * as moment from 'moment';

class BasicInteraction {

    questionClassifier(message: botbuilder.IMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            var asked: string;
            var target: string;
            basicIdentifier.questions.forEach((question) => {
                if (message.text.includes(question)) {
                    asked = question;
                    basicIdentifier.credentials.forEach((credential) => {
                        if (message.text.includes(credential)) {
                            this.botCredentialQuestion(asked, message).then((credentialAnswer) => {
                                resolve(credentialAnswer);
                            }).catch(() => {
                                this.dailyQuestion(question, message).then((dailyAnswer) => {
                                    resolve(dailyAnswer);
                                }).catch(() => {
                                    reject('I could not understand that daily.');
                                })
                            })
                        } else {
                            reject('I could not understand that credential.');
                        }
                    })
                }
                reject('I could not understand that any.');
            })
        })
    }

    private botCredentialQuestion(question: string, message: botbuilder.IMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            if (message.text.includes('age')) {
                resolve(botCredentials.age);
            } else if (message.text.includes('name')) {
                resolve(botCredentials.name);
            } else if (message.text.includes('born')) {
                resolve(botCredentials.born);
            } else {
                reject();
            }
        })

    }

    dailyQuestion(question: string, message: botbuilder.IMessage): Promise<string> {
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