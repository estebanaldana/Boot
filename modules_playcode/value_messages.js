const 
	MessageTemplate = require('./templates.js'),
	Api = require('./apis.js'),
	mongo = require('./mongodb.js')

var evaluateMessage = function (recipientId, message){

	var finalMessage = '';

	mongo.messageWords(recipientId, message);

	mongo.messageVerbs(recipientId, message);

	mongo.messageTemplates(recipientId, message);
}

module.exports = { 
	evaluateMessage: evaluateMessage
};