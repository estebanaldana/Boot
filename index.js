const 
	bodyParser = require('body-parser'), 
	express = require('express'), 
	request = require('request'),
	app = express(),
	token = process.env.FB_VERIFY_TOKEN,
	accessToken = process.env.FB_ACCESS_TOKEN,
	valueMessage = require('./modules_playcode/value_messages.js'),
	fs = require('fs');

app.set('port', (process.env.PORT));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/status'));

if(!(token && accessToken)){
	console.log("Configura los Valores 'FB_VERIFY_TOKEN', 'FB_ACCESS_TOKEN', 'PORT'");
	process.exit(1);
}

app.get('/', function(req, res){
	res.send('Bienvenido');
});


app.get('/webhook', function(req, res){
	 
	if(req.query['hub.mode'] === 'subscribe' &&	
		req.query['hub.verify_token'] === token){

		res.status(200).send(req.query['hub.challenge']);
	}
	else{
		res.send('ERROR');
	}
});

app.get('/politicadeprivacidad', function(req, res) {
	fs.readFile('templates/pdp.html', function(err, data) {
    	res.writeHead(200, {'Content-Type': 'text/html'});
    	res.write(data);
    	res.end();
  	});
});


app.get('/terminosycondiciones', function(req, res) {
	fs.readFile('templates/tyc.html', function(err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	});
});


app.post('/webhook', function(req, res){
	var data = req.body;
	console.log(data);

	if(data.object == 'page'){

		data.entry.forEach(function(pageEntry){

			var pageID = pageEntry.id;
			var timeOfEvent = pageEntry.time;

			pageEntry.messaging.forEach(function(messagingEvent){

				console.log("Entro");
				if(messagingEvent.message){
					receiveMessage(messagingEvent);
				}else{
					console.log("messagingEvent: ", messagingEvent);
				}

			});
		});

		res.sendStatus(200);
	}
});


function receiveAuthentication(event){
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfAuth = event.timestamp;

	var passThroughParam = event.option.ref;

	console.log("received authentication for user %d and page %d with pass" + "through param '%s' at %d", senderID, recipientID, passThroughParam, timeOfAuth);

	valueMessage.evaluateMessage(senderID, "authentication successful");
}


function receiveMessage(event){
	console.log(event);
	var senderID = event.sender.id;
	var message = event.message;
	var timeOfMessage = event.timestamp;
	var recipientId = event.recipient.id;

	console.log("senderID: %d", senderID);
	console.log("recipientId: %d", recipientId);
	console.log("timeOfMessage: %d", timeOfMessage);
	console.log(JSON.stringify(message));

	var isEcho = message.is_echo;
	var messageId = message.mid;
	var appId = message.app_id;
	var metadata = message.metadata;


	var messageText = message.text;
	var messageAttachments = message.attachments;
	var quickReply = message.quick_reply;

	if(isEcho){
		console.log("Received echo for message %s and app %d with metadata %s", 
      messageId, appId, metadata);
		return;
	}else if(quickReply){
		var quickReplyPayload = quickReply.payload;
		console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);

		valueMessage.evaluateMessage(senderID, "quick reply tapped");
		return;
	}
	
	valueMessage.evaluateMessage(senderID, messageText);
}

/*Listener*/
app.listen(app.get('port'), function(){
	console.log("el servidor se encuentra en el puerto", app.get('port'));
});

module.exports = app;
