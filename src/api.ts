import * as botbuilder from 'botbuilder';
import * as restify from 'restify';
import * as logger from 'morgan';
import * as http from 'http';

import config from './config';

import basicInteractionHandler from './ai/basicinteraction';

class NlpApp {

    server: restify.Server;
    bot: botbuilder.UniversalBot;
    intents: botbuilder.IntentDialog;

    next: Function;

    basicChat() {
        this.bot.dialog('/', [
            function (session) {
                var message = session.message;

                if (message.text.includes('request')) {
                    session.beginDialog('/prompt');
                } else {
                    this.next();
                }
            },
            function (session) {
                var message = session.message;

                basicInteractionHandler.questionClassifier(message).then((answer) => {
                    session.send(answer.toString());
                }).catch((rejectMsg) => {
                    session.send(rejectMsg);
                })
            }
        ]);

        this.bot.dialog('/prompt', [
            function (session) {
                botbuilder.Prompts.confirm(session, "Are you sure you would like to continue?");
            },
            function (session, results: botbuilder.IPromptConfirmResult) {
                if (results.response) {
                    session.endDialog('Done as you wished');
                } else {
                    session.endDialog('Cancelled.');
                }
            }
        ])

    }

    basicIntents() {
        this.intents.matches(/^version/i, botbuilder.DialogAction.send('Bot version 1.2'));
    }

    loadBot() {
        return new Promise((resolve, reject) => {

            var connector = new botbuilder.ChatConnector({
                appId: '',
                appPassword: ''
            });

            this.bot = new botbuilder.UniversalBot(connector);
            this.intents = new botbuilder.IntentDialog();
            this.server.post('/api/messages', connector.listen());
            this.basicChat();
            // this.basicIntents();
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