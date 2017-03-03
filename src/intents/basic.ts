import * as botbuilder from 'botbuilder';

class BasicIntents {

    private intents: botbuilder.IntentDialog;

    loadBasicIntents() {
        this.bot.dialog('/', this.intents);

        this.intents.matches(/^change my name/i, [
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
                session.send('Welcome %s!', session.userData.name);
                botbuilder.Prompts.confirm(session, 'Would you like to receive a service?')
            },
            function (session, results) {
                if (results.response) {
                    session.beginDialog('/theraphyidentifier');
                } else {
                    session.send('Sure, as you wish!');
                }
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

    loadTheraphyIntents() {
        this.intents.matches(/^theraphy/i, [
            (session) => {
                if (!session.userData.name) {
                    session.beginDialog('/profile')
                }
                else {
                    session.beginDialog('/theraphyidentifier')
                }
            },
            (session: botbuilder.Session, results: botbuilder.IPromptResult<string>) => {
                session.endDialog();
            }
        ])

        this.bot.dialog('/theraphyidentifier', [
            (session) => {
                botbuilder.Prompts.choice(session, 'Which service would you like to receive?', 'Therapist | Personal Trainer | Dietitian');
            },
            (session: botbuilder.Session, results: botbuilder.IPromptChoiceResult) => {
                session.userData.request = results.response.entity;
                session.send(`Great! I will arrange a ${session.userData.request} for you, ${session.userData.name}!`);
                session.endDialog();
            }
        ])
    }

    constructor(public bot: botbuilder.UniversalBot) {
        this.intents = new botbuilder.IntentDialog();
    }
}

export var Basic: BasicIntents;

export default (bot: botbuilder.UniversalBot) => (Basic = new BasicIntents(bot));