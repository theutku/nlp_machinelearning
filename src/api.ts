import * as botbuilder from 'botbuilder';
import * as restify from 'restify';
import * as logger from 'morgan';
import * as http from 'http';

import config from './config';

import basicInteractionHandler from './ai/basicinteraction';

class NlpApp {

    server: restify.Server;

    basicChat(bot: botbuilder.UniversalBot) {
        bot.dialog('/', function (session) {
            var message = session.message;
            console.log(message);
            basicInteractionHandler.questionClassifier(message).then((answer) => {
                console.log(answer);
                session.send(answer.toString());
            }).catch((rejectMsg) => {
                console.log(rejectMsg);
                session.send(rejectMsg);
            })
        });
    }

    loadBot() {
        return new Promise((resolve, reject) => {

            var connector = new botbuilder.ChatConnector({
                appId: '',
                appPassword: ''
            });

            var bot = new botbuilder.UniversalBot(connector);
            this.server.post('/api/messages', connector.listen());

            this.basicChat(bot)
            resolve();
        })

    }

    init() {
        return new Promise((resolve, reject) => {
            this.server.listen(config.port, (err: Error) => {
                if (err) {
                    console.log(err);
                    process.exit(2);
                }
                console.log('Bot App initializing at port: ', this.server.url);
                this.loadBot().then(() => {
                    resolve();
                })
            });

        })

    }

    constructor() {
        this.server = restify.createServer();
    }
}

export var App: NlpApp;

export default () => (App = new NlpApp());