var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

//const APP_TOKEN = 'EAAQhJ6EboPkBAF4Rcs8exvMdTtiWS9VqCk5jD3ygZCROfretwTnrS2cSWlVoNgAoBJhOZCofZB1aZAtVxtwLHnPOrhPK8qdnDmKxMVp6DslUiSTZBRoLslXI1v1FuHhEC8RZCscRCtKZBLK9IFOlLC5eBm0MVrucT9UIHok5JnqmgZDZD';
const mytoken = process.env.FB_VERIFY_TOKEN
const accesstoken = process.env.FB_ACCESS_TOKEN

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function(){
	console.log("el servidor se encuentra en el puerto", app.get('port'));
});

app.get('/', function(req, res){
	res.send('Bienvenido');
});


app.get('/webhook', function(req, res){
	 
	if(req.query['hub.verify_token'] === mytoken){
		res.send(req.query['hub.challenge']);
	}
	else{
		res.send('Tu no tinenes que estar aqui');
	}
});


app.post('/webhook', function(req, res){
	var data = req.body;
	console.log(data);
	if(data.object === 'page'){

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
	console.log(event);
	var senderID = event.sender.id;
	var message = event.message;
	var recipientId = event.recipient.id;

	console.log(senderID);
	console.log(recipientId);
	console.log(JSON.stringify(message));

	var messageId = message.mid;

	var messageText = message.text;
	var messageAttachments = message.attachment;

	console.log(messageText);

	if(messageText){

		switch(messageText){

			case 'generic':
				genericMessage(senderID);
				break;
			default:
				evaluateMessage(senderID, messageText);
		}
	}else if (messageAttachments){
		evaluateMessage(senderID, "attachment received");
	}
}




function evaluateMessage(recipientId, message){

	var finalMessage = '';


	if(isContain(message, 'ayuda')){
		finalMessage = 'por el momento no te puedo ayudar';
	}


	else if(isContain(message, 'hola') || isContain(message, 'Hola')){

		if(isContain(message, 'janette')){
			finalMessage = "Hola te kelo :)";
		}

		else if(isContain(message, 'mama')){
			finalMessage='que quieres ya vas a empesar a moler';
		}

		else{
			finalMessage = "Hola Quien Eres";
		}
	}

	else if(isContain(message,'imagen')){
		finalMessage='imagen de que?';
		if(isContain(message, 'gato')){
			sendMessageImage(recipientId);
		}
	}

	else if(isContain(message, 'clima')){
		getWeather(function(temperature){
			message = getMessageWeather(temperature);
			sendMessageText(recipientId,message);
		});
	}

	else if(isContain(message, 'luke')){
		if(isContain(message, 'star wars')){
			getStarWars(function(name, estatura){
			message = name +estatura;
			sendMessageText(recipientId,message);
			});
		}
		else{
			finalMessage='de que luke hablas';
		}
	}

	else if(isContain(message, 'info')){
		 sendMessageTemplate(recipientId);
	}

	else{
		finalMessage = 'solo repetir: ' + message;
	}

	sendMessageText(recipientId, finalMessage);
}

function genericMessage(recipientId){
	var messageData = {
		recipient: {
			id: recipientID
		},
		message: {
			attachment: {
				type: "template".
				playload: {
					template_type: "generic",
					elements: [{
						title: "rift",
						subtitle: "Next-generation virtual reality",
						item_url: "https://www.oculus.com/en-us/rifft",
						image_url: "https://messengerdemo.parseapp.com/imgrift.png",
						buttons: [{
							type: "web_url",
							url: "http://www.oculus.com/en-us/rift/",
							title: "open web url"
						}, {
							type: "postback",
							title:"call postback",
							payload: "payload for first bubble",
						}],
					}, {
						title: "touch",
						subtitle: "your hands, noe in vr",
						item_url: "https://www.oculus.com/en-us/touch/",
						image_url: "https//messengerdemo.parseapp.com/img/touch.png",
						buttons: [{
							type: "web_url",
							url: "https://www.oculus.com/en-us/touch/",
							title: "open web url"
						}, {
							type: "postback"
							title: "call postback",
							payload: "payload for second bubble",
						}]
					}]
				}
			}
		}
	};
	callSendAPI(messageData);
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


function sendMessageImage(recipientId){
	var messageData = { 
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "image",
				payload: {
					url: "http://i.imgur.com/SOFXhd6.jpg"
				}
			}
		}
	};
	callSendAPI(messageData);
}

//template
function sendMessageTemplate(recipientId){
	var messageData = {
		recipient:{
			id : recipientId
		},
		message:{
			attachment:{
				type: "template",
				payload:{
					template_type: "generic",
					elements: [ elemenTemplate() ]
				}
			}
		}
	};
	callSendAPI(messageData);
}


function elemenTemplate(){
	return{
		title :"Esteban",
		subtitle: "prueba",
		item_url: "https://www.facebook.com/PlayCodeCompany",
		image_url: "http://vignette2.wikia.nocookie.net/especiesaliens/images/6/6b/006.jpg/revision/latest?cb=20111220014746&path-prefix=es",
		buttons: [ buttonTemplate() ],
	}
}

function buttonTemplate(){
	return{
		type: "web_url",
		url: "https://www.youtube.com/channel/UCsVYL93M_Higkf4gRw0kALw",
		title:"EA",
	}
}


function callSendAPI(messageData){
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs : { access_token : accesstoken },
		method: 'POST',
		json: messageData
	},function(error, response, data){
		if(error && response.statusCode == 200){
			var recipientID = data.recipient_id;
			var messageID = data.message_id;
			console.log('No es posible enviar el mensaje el mesaje %s y con el recipiente %s', messageID, recipientID);
		}
		else{
			console.log('El mensaje fue enviado');
			console.error(messageID);
			console.error(recipientID);
		}
	});
}

//mensaje de la temperatura 
function getMessageWeather(temperature){
	if(temperature > 30){
		return "hay demaciado calor la temperatura es de " +temperature +"º";
	}
	return "la temperatura es de" +temperature +"º es un buen dia";
}

//api clima
function getWeather( callback ){
	request('http://api.geonames.org/findNearByWeatherJSON?formatted=true&lat=42&lng=-2&username=demo&style=full',
	function(error, response, data){
		if(!error){
			var response = JSON.parse(data);
			var temperature = response.weatherObservation.temperature;
			callback(temperature);
		}
	});

}

function getStarWars( callback ){
	request('http://swapi.co/api/people/1/',
	function(error, response, data){
		if(!error){
			var response = JSON.parse(data);
			var personaje = response.name;
			callback(personaje);
		}
		if(!error){
			var response = JSON.parse(data);
			var estatura = response.height;
			callback(estatura);
		}
		if(!error){
			var response= JSON.parse(data);
			var sexo = response.gender;
			callback(sexo);
		}
	});
}


function isContain(sentence, word){
	return sentence.indexOf(word) > -1;
}
