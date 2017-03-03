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

    loadIntents() {
        return new Promise((resolve, reject) => {
            BasicIntents(this.bot).loadBasicIntents();
            BasicIntents(this.bot).loadTheraphyIntents();
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