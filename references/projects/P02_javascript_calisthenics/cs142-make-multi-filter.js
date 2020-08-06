"use strict";

var cs142MakeMultiFilter = function (originalArray) {
	var arrayFilterer = function (filterCriteria, callback) {
		if (typeof filterCriteria !== "function") {
			return arrayFilterer.currentArray;
		}
		for (let i = 0; i < arrayFilterer.currentArray.length; ) {
			if (filterCriteria(arrayFilterer.currentArray[i]) === false) {
				arrayFilterer.currentArray.splice(i, 1); //inplace: rm 1 elem at i.
			} else {
				i++;
			}
		}
		if (typeof callback === "function") {
			//src: https://gist.github.com/zcaceres/2a4ac91f9f42ec0ef9cd0d18e4e71262
			//For FUNCTION.apply() we pass in the this we'd like to use, along with parameters in an array.
			callback.apply(originalArray, [arrayFilterer.currentArray]);
		}
		return arrayFilterer;
	};
	arrayFilterer.currentArray = originalArray.slice(0); //make a copy. o.w. original will be modified.
	return arrayFilterer;
};



//Debug
// var arrayFilterer1 = cs142MakeMultiFilter([1,2,3]);
// arrayFilterer1(function (elem) {
//   return elem !== 2; // check if element is not equal to 2
// }, function (currentArray) {
//   console.log(this); // printing 'this' within the callback function should print originalArray which is [1,2,3]
//   console.log(currentArray); // prints [1, 3]
// });