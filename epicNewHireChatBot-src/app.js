var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

bot.dialog('/', function (session) {
    session.send('¡Hola! Bienvenido al asistente digital de soporte');
    builder.Prompts.choice(session, "¿Con que te puedo ayudar?", "Redes y Conexión|Tickets y Soporte|Software|Hardware|Transporte", 
        { listStyle: builder.ListStyle.button });
        session.endDialog();
});

bot.dialog('help', function(session) {
    session.send('Hola, soy un asistente digital y estoy listo para ayudarte.');
    session.send({
            text: "Simplemente inicia una conversación conmigo enviandome un saludo y yo te respondere con opciones como estas: ",
            attachments: [
                {
                    contentType: 'image/png',
                    contentUrl: 'http://i.magaimg.net/img/30y0.png',
                    name: 'bot_interaction'
                }
            ]
        });
        session.endDialog();
}).triggerAction({
    matches: /^help$/i
});

bot.dialog('Transporte', function(session) {
    session.send({
            text: "Transporte al estacionamiento",
            attachments: [
                {
                    contentType: 'image/png',
                    contentUrl: 'http://images.clipartpanda.com/passenger-van-clipart-white_van-448x222.jpg',
                    name: 'white_van'
                }
            ]
        });
    session.send('Los horarios de transporte al estacionamiento secundario son de 6:45AM a 9:45AM y de 3:45PM a 6:00PM');
    session.send('Las vans salen cada 15 minutos.')
    session.endDialog();
}).triggerAction({
    matches: /^Transporte$/i
});
