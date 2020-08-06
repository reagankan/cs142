"use strict";

//THIS WILL FAIL DUE TO CONFLICTING GLOBAL VARS declared in cs142-test-project2.js
// class Cs142TemplateProcessor {
// 	constructor(template) {
// 		this.template = template;
// 	}
// 	fillIn(dictionary) {
// 		var filledTemplate = this.template.slice(0);
// 		for (let k of Object.keys(dictionary)) {
// 			var regex = new RegExp("\{\{"+k+"\}\}");
// 			filledTemplate = filledTemplate.replace(regex, dictionary[k]);
// 		}

// 		//var re = /pattern/flags;
// 		//pattern: [A-Z] any capital letter
// 		//flag: i ignore case.
// 		filledTemplate = filledTemplate.replace(/\{\{[A-Z]*\}\}/i, "");
// 		return filledTemplate;
// 	}
// }

function Cs142TemplateProcessor (template) {
	this.template = template;
};
Cs142TemplateProcessor.prototype = {
	fillIn: function(dictionary) {
		var filledTemplate = this.template.slice(0);
		for (let k of Object.keys(dictionary)) {
			var regex = new RegExp("\{\{"+k+"\}\}");
			filledTemplate = filledTemplate.replace(regex, dictionary[k]);
		}

		//var re = /pattern/flags;
		//pattern: [A-Z] any capital letter
		//flag: i ignore case.
		filledTemplate = filledTemplate.replace(/\{\{[A-Z]*\}\}/i, "");
		return filledTemplate;
	}
};


/*
var assert = require("assert");
var template = 'My favorite month is {{month}} but not the day {{day}} or the year {{year}}';
var dateTemplate = new Cs142TemplateProcessor(template);

var dictionary = {month: 'July', day: '1', year: '2016'};
var str = dateTemplate.fillIn(dictionary);

assert(str === 'My favorite month is July but not the day 1 or the year 2016');

//Case: property doesn't exist in dictionary
var dictionary2 = {day: '1', year: '2016'};
var str = dateTemplate.fillIn(dictionary2);

assert(str === 'My favorite month is  but not the day 1 or the year 2016');

*/
