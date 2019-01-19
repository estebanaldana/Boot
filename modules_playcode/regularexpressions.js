var regularExpressions = function(word) {
	var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

	for (var i = 0; i < specialChars.length; i++) {
		word = word.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
	}

	word = word.toLowerCase();

	word = word.replace(/á/gi,"a");
	word = word.replace(/é/gi,"e");
	word = word.replace(/í/gi,"i");
	word = word.replace(/ó/gi,"o");
	word = word.replace(/ú/gi,"u");

	return word;
}


var divideString = function(char, word) {
	var regExp = regularExpressions(char);
	var wordVerbs = regExp.indexOf(word);
	var charLength = regExp.length;
	var divideWord = regExp.substring(wordVerbs, charLength);
	var newWord = divideWord.replace(word, "");

	return newWord;
}

var JsonString = function(docs, parameter) {
	var value = JSON.stringify(docs);
	var removeBrackets = value.replace("[","").replace("]", "");
	var objectResponse = JSON.parse(removeBrackets);
	var response = objectResponse[parameter];
	return response;
}

module.exports = {
	regularExpressions: regularExpressions,
	divideString: divideString,
	JsonString: JsonString
}