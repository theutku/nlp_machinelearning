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
                botbuilder.Prompts.confirm(session, 'Would you like to schedule an appointment with a consultant?')
            },
            function (session, results) {
                if (results.response) {
                    session.beginDialog('/theraphyidentifier');
                } else {
                    session.endDialog('Sure, as you wish!');
                }
            }
        ]);

        this.bot.dialog('/profile', [
            function (session) {
                botbuilder.Prompts.text(session, 'Hi! What is your name?');
            },
            function (session, results) {
                session.userData.name = results.response;
                session.endDialog('nice meeting you %s!', session.userData.name);
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
        ]);

        this.bot.dialog('/theraphyidentifier', [
            (session) => {
                botbuilder.Prompts.choice(session, 'Which consultant would you like to consult to?', 'Therapist | Personal Trainer | Dietitian');
            },
            (session: botbuilder.Session, results: botbuilder.IPromptChoiceResult) => {
                session.userData.request = results.response.entity;
                session.send(`Great! I will schedule a ${session.userData.request} for you, ${session.userData.name}!`);
                session.beginDialog('/promptemail');
            }
        ])

        this.bot.dialog('/promptemail', [
            (session) => {
                botbuilder.Prompts.confirm(session, 'Would you like me to send the details of your appointment to your e - mail address?');
            },
            (session: botbuilder.Session, results: botbuilder.IPromptConfirmResult) => {
                if (results.response) {
                    session.beginDialog('/getemail');
                } else {
                    var schedule = new Date();
                    session.send(`As you wish! Please note that your chat is on ${schedule}, ${session.userData.name}!`);
                    session.endConversation();
                }
            }
        ])

        this.bot.dialog('/getemail', [
            (session) => {
                botbuilder.Prompts.text(session, 'Can I get your e - mail address?');
            },
            (session: botbuilder.Session, results: botbuilder.IPromptTextResult) => {
                session.userData.email = results.response
                session.send(`All Done! I have sent details of your appointment to ${session.userData.email}, ${session.userData.name}!`);
                session.endConversation();
            }
        ])
    }

    constructor(public bot: botbuilder.UniversalBot) {
        this.intents = new botbuilder.IntentDialog();
    }
}

export var Basic: BasicIntents;

export default (bot: botbuilder.UniversalBot) => (Basic = new BasicIntents(bot));