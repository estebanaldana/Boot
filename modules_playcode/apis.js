/*API Facebook Message*/
const 
	request = require('request'),
	accesstoken = process.env.FB_ACCESS_TOKEN

var callSendAPI = function (messageData){
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs : { access_token : accesstoken },
		method: 'POST',
		json: messageData
	},function(error, response, data){
		if(!error && response.statusCode == 200){
			var recipientId = data.recipient_id;
			var messageId = data.message_id;

			if(messageId){
				console.log('el mesaje %s y con el recipiente %s se a enviado', messageId, recipientId);
			}else{
				console.log('el mensaje API recipient %s', recipientId);
			}
		}
		else{
			console.log('error');
			console.error(messageId);
			console.error(recipientId);
		}
	});
}



/*API Star Wars*/
var getStarWars = function (callback){
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



/*API Clima-Temperatura*/
var getWeather = function (callback){
	request('http://api.geonames.org/findNearByWeatherJSON?formatted=true&lat=42&lng=-2&username=demo&style=full',
	function(error, response, data){
		if(!error){
			var response = JSON.parse(data);
			var temperature = response.weatherObservation.temperature;
			callback(temperature);
		}
	});

}

module.exports = {
	callSendAPI: callSendAPI,
	getStarWars: getStarWars,
	getWeather: getWeather
};