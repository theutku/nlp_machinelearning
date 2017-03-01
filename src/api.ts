import * as botbuilder from 'botbuilder';
import * as restify from 'restify';
import * as logger from 'morgan';
import * as http from 'http';

import config from './config';

class NlpApp {

    server: restify.Server;

    test() {

    }

    laodBot() {
        return new Promise((resolve, reject) => {

            var connector = new botbuilder.ChatConnector({
                appId: '',
                appPassword: ''
            });

            var bot = new botbuilder.UniversalBot(connector);
            this.server.post('/api/messages', connector.listen());

            bot.dialog('/', function (session) {
                session.send("Hello World!");
            });
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
                this.laodBot().then(() => {
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