const Api = require('./apis.js')

//template
var sendMessageTemplate = function (recipientId){
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
	Api.callSendAPI(messageData);
}

/*Mensaje de la Temperatura*/ 
var getMessageWeather = function (temperature){
	if(temperature > 30){
		return "hay demaciado calor la temperatura es de " +temperature +"º";
	}
	return "la temperatura es de" +temperature +"º es un buen dia";
}

/*Image*/
var sendMessageImage = function (recipientId){
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
	Api.callSendAPI(messageData);
}

/*Text */
var sendMessageText = function (recipientId, message) {

	var messageData = {

		recipient: {
			id: recipientId
		},
		message: {
			text: message
		}

	};
	Api.callSendAPI(messageData);
}


/*Elements*/
function elemenTemplate(){
	return {
		title :"PLAY;CODE",
		subtitle: "Hola yo soy codiguito, En este enlace podras saber mas sobre mi",
		item_url: "https://www.facebook.com/PlayCodeCommunity",
		image_url: "https://playcode.herokuapp.com/static/imagenes/portada.jpg",
		buttons: [ buttonTemplate() ],
	}
}

/*Button*/
function buttonTemplate(){
	return {
		type: "web_url",
		url: "https://www.youtube.com/channel/UCsVYL93M_Higkf4gRw0kALw",
		title:"Canal YouTube",
	}
}

module.exports = {
	sendMessageTemplate: sendMessageTemplate,
	getMessageWeather: getMessageWeather,
	sendMessageImage: sendMessageImage, 
	sendMessageText: sendMessageText
};
