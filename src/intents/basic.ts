import * as botbuilder from 'botbuilder';

class BasicIntents {

    private intents: botbuilder.IntentDialog;

    loadBasicIntents() {
        this.bot.dialog('/', this.intents);

        this.intents.matches(/^change name/i, [
            function (session) {
                session.beginDialog('/profile');
            },
            function (session, results) {
                session.send('Ok... Changed your name to %s', session.userData.name);
            }
        ]);

        this.intents.onDefault([
            function (session, args, next) {
                if (!session.userData.name) {
                    session.beginDialog('/profile');
                } else {
                    next();
                }
            },
            function (session, results) {
                session.send('Welcome back %s!', session.userData.name);
            }
        ]);

        this.bot.dialog('/profile', [
            function (session) {
                botbuilder.Prompts.text(session, 'Hi! What is your name?');
            },
            function (session, results) {
                session.userData.name = results.response;
                session.endDialog();
            }
        ]);
    }

    constructor(public bot: botbuilder.UniversalBot) {
        this.intents = new botbuilder.IntentDialog();
    }
}

export var Basic: BasicIntents;

export default (bot: botbuilder.UniversalBot) => (Basic = new BasicIntents(bot));