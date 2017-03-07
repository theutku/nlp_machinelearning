import * as botbuilder from 'botbuilder';
import * as restify from 'restify';
import * as logger from 'morgan';
import * as http from 'http';

import config from './config';

import BasicIntents from './intents/basic';

class NlpApp {

    server: restify.Server;
    bot: botbuilder.UniversalBot;

    loadBot() {
        return new Promise((resolve, reject) => {

            var connector = new botbuilder.ChatConnector({
                appId: '',
                appPassword: ''
            });

            this.bot = new botbuilder.UniversalBot(connector);
            this.server.post('/api/messages', connector.listen());
            resolve();
        })

    }

    loadLuis() {
        // var recognizer = new botbuilder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/3b048389-13ea-4709-81d8-8000355acac4?subscription-key=2658947utb56901shuorls981068yrbs&staging=true&verbose=true&spellCheck=true&q=')
        // this.bot.recognizer(recognizer);
    }

    loadIntents() {
        return new Promise((resolve, reject) => {
            // BasicIntents(this.bot).loadBasicIntents();
            // BasicIntents(this.bot).loadTheraphyIntents();
            BasicIntents(this.bot).testIntent();
            BasicIntents(this.bot).builtIn();
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
                console.log('Bot App started listening at port: ', this.server.url, ' ...');
                this.loadBot().then(() => {
                    console.log('Bot initialized...');
                    this.loadLuis();
                    this.loadIntents().then(() => {
                        console.log('Intents initialized...');
                        resolve();
                    })
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