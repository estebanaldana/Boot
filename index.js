var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN = 'EAAQhJ6EboPkBAD7A0BgAXLZBmZCtg9xmNUZAwdgZCwQtb61N9IU79OZCjgxyvKAFJLB9XPHnNXqr6j94X7yoGbmnrhhTZBgDkO795gNisvwJSgJ0WaMB0aMSn5I3WZCXlQEApaCsICLpxwVEJhmqAtPo8WhT34kmLKOvWH5X5QpeAZDZD';

var app = express();
app.use(bodyParser.json());

app.listen(3000, function(){
	console.log("el servidor se encuentra en el puerto 3000");
});

app.get('/', function(req, res){
	res.send('Bienvenido');
});


app.get('/webhook', function(req, res){
	 
	if(req.query['hub.verify_token'] === 'estebanah123456789'){
		res.send(req.query['hub.challenge']);
	}
	else{
		res.send('Tu no tinenes que estar aqui');
	}
});


app.post('/webhook', function(req, res){
	var data = req.body;
	//console.log(data);
	if(data.object == 'page'){

		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){

				console.log("Entro");

				if(messagingEvent.message){
					receiveMessage(messagingEvent);
				}

			});
		});

		res.sendStatus(200);

	}
});


function receiveMessage(event){
	//console.log(event);
	var senderID = event.sender.id;
	var messageText = event.message.text;

	//console.log(senderID);
	//console.log(messageText);

	evaluateMessage(senderID, messageText);
}

function evaluateMessage(recipientId, message){

	var finalMessage = '';


	if(isContain(message, 'ayuda')){
		finalMessage = 'por el momento no te puedo ayudar';
	}


	else if(isContain(message, 'hola')){
		finalMessage = "Hola";
		finalMessage = "Quien Eres"
		if(isContain(message, 'esteban')){
			finalMessage = 'Hola que tal';
		}
	}

	else if(isContain(message, 'janette')){
		finalMessage = "Hola Como Estas";
	}

	else if(isContain(message, 'daisame')){
		finalMessage = "Hola :)";
	}

	else if(is isContain(message, 'isabel')){
		finalMessage = 'Hola que tal'
	}

	else if(is isContain(message, 'laura')){
		finalMessage = 'que quieres mejor dicho para no hacer larga la conversacion dejame en paz'
	}

	else{
		finalMessage = 'solo repetir: ' + message;
	}

	sendMessageText(recipientId, finalMessage);
}

function sendMessageText(recipientId, message) {

	var messageData = {

		recipient: {
			id: recipientId
		},
		message: {
			text: message
		}

	};
	callSendAPI(messageData);
}


function callSendAPI(messageData){
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs : { access_token : APP_TOKEN },
		method: 'POST',
		json: messageData
	},function(error, response, data){
		if(error){
			console.log('No es posible enviar el mensaje');
		}
		else{
			console.log('El mensaje fue enviado');
		}
	});
}


function isContain(sentence, word){
	return sentence.indexOf(word) > -1;
}
