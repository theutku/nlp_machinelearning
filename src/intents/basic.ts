import * as botbuilder from 'botbuilder';

class BasicIntents {

    private intents: botbuilder.IntentDialog;

    // loadBasicIntents() {
    //     this.bot.dialog('/', this.intents);

    //     this.intents.matches(/^change my name/i, [
    //         function (session) {
    //             session.beginDialog('/profile');
    //         },
    //         function (session, results) {
    //             session.send('Ok... Changed your name to %s', session.userData.name);
    //         }
    //     ]);

    //     this.intents.onDefault([
    //         function (session, args, next) {
    //             if (!session.userData.name) {
    //                 session.beginDialog('/profile');
    //             } else {
    //                 next();
    //             }
    //         },
    //         function (session, results) {
    //             session.send('Welcome %s!', session.userData.name);
    //             botbuilder.Prompts.confirm(session, 'Would you like to schedule an appointment with a consultant?')
    //         },
    //         function (session, results) {
    //             if (results.response) {
    //                 session.beginDialog('/theraphyidentifier');
    //             } else {
    //                 session.endDialog('Sure, as you wish!');
    //             }
    //         }
    //     ]);

    //     this.bot.dialog('/profile', [
    //         function (session) {
    //             botbuilder.Prompts.text(session, 'Hi! What is your name?');
    //         },
    //         function (session, results) {
    //             session.userData.name = results.response;
    //             session.endDialog('nice meeting you %s!', session.userData.name);
    //         }
    //     ]);
    // }

    // loadTheraphyIntents() {
    //     this.intents.matches(/^theraphy/i, [
    //         (session) => {
    //             if (!session.userData.name) {
    //                 session.beginDialog('/profile')
    //             }
    //             else {
    //                 session.beginDialog('/theraphyidentifier')
    //             }
    //         },
    //         (session: botbuilder.Session, results: botbuilder.IPromptResult<string>) => {
    //             session.endDialog();
    //         }
    //     ]);

    //     this.bot.dialog('/theraphyidentifier', [
    //         (session) => {
    //             botbuilder.Prompts.choice(session, 'Which consultant would you like to consult to?', 'Therapist | Personal Trainer | Dietitian');
    //         },
    //         (session: botbuilder.Session, results: botbuilder.IPromptChoiceResult) => {
    //             session.userData.request = results.response.entity;
    //             session.send(`Great! I will schedule a ${session.userData.request} for you, ${session.userData.name}!`);
    //             session.beginDialog('/promptemail');
    //         }
    //     ])

    //     this.bot.dialog('/promptemail', [
    //         (session) => {
    //             botbuilder.Prompts.confirm(session, 'Would you like me to send the details of your appointment to your e - mail address?');
    //         },
    //         (session: botbuilder.Session, results: botbuilder.IPromptConfirmResult) => {
    //             if (results.response) {
    //                 session.beginDialog('/getemail');
    //             } else {
    //                 var schedule = new Date();
    //                 session.send(`As you wish! Please note that your chat is on ${schedule}, ${session.userData.name}!`);
    //                 session.endConversation('Have a nice day!');
    //             }
    //         }
    //     ])

    //     this.bot.dialog('/getemail', [
    //         (session) => {
    //             botbuilder.Prompts.text(session, 'Can I get your e - mail address?');
    //         },
    //         (session: botbuilder.Session, results: botbuilder.IPromptTextResult) => {
    //             session.userData.email = results.response
    //             session.send(`All Done! I have sent details of your appointment to ${session.userData.email}, ${session.userData.name}!`);
    //             session.endConversation();
    //         }
    //     ])
    // }

    builtIn() {
        var alarms = {};
        setInterval(function () {
            var now = new Date().getTime();
            for (var key in alarms) {
                var alarm = alarms[key];
                if (now >= alarm.timestamp) {
                    var msg = new botbuilder.Message()
                        .address(alarm.address)
                        .text("Here's your '%s' alarm.", alarm.title);
                    this.bot.send(msg);
                    delete alarms[key];
                }
            }
        }, 15000);

        this.intents.matches('builtin.intent.alarm.set_alarm', [
            function (session, args, next) {
                // Resolve and store any entities passed from LUIS.
                var title = botbuilder.EntityRecognizer.findEntity(args.entities, 'builtin.alarm.title');
                var time = botbuilder.EntityRecognizer.resolveTime(args.entities);
                var alarm = session.dialogData.alarm = {
                    title: title ? title.entity : null,
                    timestamp: time ? time.getTime() : null
                };

                // Prompt for title
                if (!alarm.title) {
                    botbuilder.Prompts.text(session, 'What would you like to call your alarm?');
                } else {
                    next();
                }
            },
            function (session, results, next) {
                var alarm = session.dialogData.alarm;
                if (results.response) {
                    alarm.title = results.response;
                }

                // Prompt for time (title will be blank if the user said cancel)
                if (alarm.title && !alarm.timestamp) {
                    botbuilder.Prompts.time(session, 'What time would you like to set the alarm for?');
                } else {
                    next();
                }
            },
            function (session, results) {
                var alarm = session.dialogData.alarm;
                if (results.response) {
                    var time = botbuilder.EntityRecognizer.resolveTime([results.response]);
                    alarm.timestamp = time ? time.getTime() : null;
                }

                // Set the alarm (if title or timestamp is blank the user said cancel)
                if (alarm.title && alarm.timestamp) {
                    // Save address of who to notify and write to scheduler.
                    alarm.address = session.message.address;
                    alarms[alarm.title] = alarm;

                    // Send confirmation to user
                    var date = new Date(alarm.timestamp);
                    var isAM = date.getHours() < 12;
                    session.send('Creating alarm named "%s" for %d/%d/%d %d:%02d%s',
                        alarm.title,
                        date.getMonth() + 1, date.getDate(), date.getFullYear(),
                        isAM ? date.getHours() : date.getHours() - 12, date.getMinutes(), isAM ? 'am' : 'pm');
                } else {
                    session.send('Ok... no problem.');
                }
            }
        ]);

        this.intents.matches('builtin.intent.alarm.delete_alarm', [
            function (session, args, next) {
                // Resolve entities passed from LUIS.
                var title;
                var entity = botbuilder.EntityRecognizer.findEntity(args.entities, 'builtin.alarm.title');
                if (entity) {
                    // Verify its in our set of alarms.
                    title = botbuilder.EntityRecognizer.findBestMatch(alarms, entity.entity);
                }

                // Prompt for alarm name
                if (!title) {
                    botbuilder.Prompts.choice(session, 'Which alarm would you like to delete?', alarms);
                } else {
                    next({ response: title });
                }
            },
            function (session, results) {
                // If response is null the user canceled the task
                if (results.response) {
                    delete alarms[results.response.entity];
                    session.send("Deleted the '%s' alarm.", results.response.entity);
                } else {
                    session.send('Ok... no problem.');
                }
            }
        ]);


    }

    testIntent() {
        this.bot.dialog('/', this.intents);
        this.intents.matches(/^consultant choice/i, [
            (session, args) => {
                session.beginDialog('/consultant');
                botbuilder.DialogAction
            }
        ])
        this.bot.dialog('/consultant', [
            (session) => {
                session.endDialog('I recognized consultant choice.');
            }
        ])

        this.intents.onDefault([
            function (session, args, next) {
                session.send('I did not get that');
            }
        ]);
    }

    constructor(public bot: botbuilder.UniversalBot) {
        var recognizer = new botbuilder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c413b2ef-382c-45bd-8ff0-f76d60e2a821?subscription-key=2658947utb56901shuorls981068yrbs&q=')
        // this.bot.recognizer(recognizer);
        this.intents = new botbuilder.IntentDialog({ recognizers: [recognizer] });
    }
}

export var Basic: BasicIntents;

export default (bot: botbuilder.UniversalBot) => (Basic = new BasicIntents(bot));