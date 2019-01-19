const
	MessageTemplate = require('./templates.js'),
	regularExpressions = require('./regularexpressions.js'),
	mongoClient = require('mongodb').MongoClient,
	conecction = process.env.MONGODB,
	dataBase = process.env.DB_BOT,
	assert = require('assert')

var finalMessage = '';
var valueRecipientId = '';
var valueWord = '';

var messageWords = function(recipientId, word) {
	valueWord = word;
	valueRecipientId= recipientId;

	var arrayWord = valueWord.split(' ');

	mongoClient.connect(conecction, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dataBase);

		findDocuments(db, function(docs) {
			if(Array.isArray(docs)){
				if (docs !== 'undefined' && docs.length > 0) {
					const resWord = regularExpressions.JsonString(docs, "response");
					MessageTemplate.sendMessageText(valueRecipientId, resWord);
				}
			}
			client.close();
 		});
	});

	const findDocuments = function(db, callback) {
		const collectionWords = db.collection('words');
		try {
			for (let word of arrayWord) {
				const regExp = regularExpressions.regularExpressions(word);
				collectionWords.find({'word': regExp }).toArray(function(err, docs) {
					assert.equal(err, null);
					if(docs !== 'undefined' && docs.length > 0) {
						callback(docs);
					}
				});
			}
		} catch(e) {
			console.log(e);
		}
	}
}

var messageVerbs = function(recipientId, word) {
	valueWord = word;
	valueRecipientId= recipientId;

	var arrayWord = valueWord.split(' ');

	mongoClient.connect(conecction, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dataBase);

		findDocumentsVerbs(db, function(docs) {
			if (docs !== 'undefined' && docs.length > 0) {
				const resWord = regularExpressions.JsonString(docs, "word");
				const responseWord = regularExpressions.divideString(valueWord, resWord);
				const resSets = regularExpressions.JsonString(docs, "data");
				valueSets(db, responseWord, resSets, function(responseWord) {
					const resSets = regularExpressions.JsonString(responseWord, "response");
					MessageTemplate.sendMessageText(valueRecipientId, resSets);
					client.close();
				});
			}
			client.close();
		});
	});

	const findDocumentsVerbs = function(db, callback) {
		const collectionVerbs = db.collection('verbs');
		try{
			for (let word of arrayWord) {
				const regExp = regularExpressions.regularExpressions(word);
				collectionVerbs.find({'word': regExp}).toArray(function(err, docs) {
					assert.equal(err,null);
					if(docs !== 'undefined' && docs.length > 0) {
						callback(docs);
					}
				});	
			}
		} catch(e) {
			console.log(e);
		}
	}

	const valueSets = function(db, responseWord, sets, callback) {
		data = String(sets);
		const collectionSets = db.collection(data);
		if (responseWord !== 'undefined') {
			const setsWord = responseWord.split(' ');
			for (let word of setsWord) {
				collectionSets.find({'word': word}).toArray(function(err, docs) {
					assert.equal(err, null);
					if(docs !== 'undefined' && docs.length > 0) {
						callback(docs);
					}
				});
			}
		}
	}
}

var messageTemplates = function(recipientId, word) {
	valueWord = word;
	valueRecipientId = recipientId;

	var arrayWord = valueWord.split(' ');

	mongoClient.connect(conecction, function(err, client) {
		assert.equal(err, null);
		const db = client.db(dataBase);

		findDocumentsTemplates(db, function(docs) {
			if (docs !== 'undefined' && docs.length > 0) {
				MessageTemplate.sendMessageTemplate(valueRecipientId);
			}
			client.close();
		});
	});

	const findDocumentsTemplates = function(db, callback){
		const collectionTemplates = db.collection('templates');
		try {
			for (let word of arrayWord) {
				const regExp = regularExpressions.regularExpressions(word);
				collectionTemplates.find({'word': regExp}).toArray(function(err, docs) {
					assert.equal(err, null);
					if (docs !== 'undefined' && docs.length > 0) {
						callback(docs);
					}
				});
			}
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = {
	messageWords: messageWords,
	messageVerbs: messageVerbs,
	messageTemplates: messageTemplates
}
