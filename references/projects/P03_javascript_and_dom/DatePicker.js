//https://stackoverflow.com/questions/3919291/when-to-use-setattribute-vs-attribute-in-javascript
var containerStyle = {
	root   : "\
			border: solid 3px black;\
			min-width: 560px;\
			",
	header : "display: flex; justify-content: space-between;",
	matrix :"\
			display: grid; grid-template-columns: repeat(7, 1fr);\
			grid-auto-rows: min(min-content,5%);\
		 	grid-gap: 0px;\
		 	",
	footer : "display: flex; justify-content: space-between;"
}

var itemStyle = {
	header : "flex-shrink: 0; font-family: Tacoma; font-size: 80px;",
	matrix : "font-family: Tacoma; font-size: 40px; border: solid 1px black;",
	footer_text : "flex-shrink: 0; font-family: Tacoma; font-size: 80px;",
	footer_img : "flex-shrink: 0;"
}

var range = function(start, end, iter=1) {
	/**
	output is always INCREASING order.
	**/
	if (start === end) {
		return [];
	}
	let answer = [];

	if (start < end) {	
		for (let i = start; i < end; i += iter) {
			answer.push(i);
		}
	} else {
		for (let i = start; i > end; i += iter) {
			answer.unshift(i);
		}
	}
	// console.log(start, end, iter, answer);
	return answer;
}
class MyDate {
	constructor(date) {
		this.date = null;
		this.update(date);
		this.firstDate = new Date(this.getYear(false), this.getMonth(false), 1);
	}
	update(date) {
		this.date = date;
		this.firstDate = new Date(this.getYear(false), this.getMonth(false), 1);
	}
	getDay(string=true) {
		if (string) {
			return this.date.toLocaleString('default', {weekday:"short"});
		}
		return parseInt(this.date.getDay());
	}
	getMonth(string=true) {
		if (string) {
			return this.date.toLocaleString('default', {month:"long"});
		}
		return parseInt(this.date.getMonth());
	}
	getDate(string=true) {
		if (string) {
			return this.date.getDate();
		}
		return parseInt(this.date.getDate());
	}
	getYear(string=true) {
		if (string) {
			return this.date.getFullYear();
		}
		return parseInt(this.date.getFullYear());
	}
	getNumDays(string=true, monthOffset=0) {
		/*
		Date(year, mon, day)
		day: like python allows negative indexing but with base index = 1. 
		*/
		var num = new Date(this.getYear(false), this.getMonth(false) + monthOffset + 1 , 0).getDate();
		// console.log(new Date(this.getYear(false), this.getMonth(false) + monthOffset + 1,  0).toString());
		if (string) {
			return num.toString();
		}
		return num;
	}
	getDays() {
		/*
		Returns
		days[List[String]]: days represented as their date number in string form.
		*/
		var daysTuple = {};

		var prevNumDays = this.getNumDays(false, -1);
		var currNumDays = this.getNumDays(false, 0);
		var headOffset = new MyDate(this.firstDate).getDay(false); //0 - 6
		

		daysTuple.days = range(prevNumDays, prevNumDays - headOffset, -1);
		daysTuple.locked = []
		for (let i = 0; i < headOffset; i++) {
			daysTuple.locked.push(true);
		}

		for (let i = 1; i <= currNumDays; i++) {
			daysTuple.days.push(i);
			daysTuple.locked.push(false);
		}
		
		var totalWeeks = Math.ceil((headOffset + currNumDays) / 7);
		var totalDays = 7 * totalWeeks;
		var tailOffset = totalDays - ((headOffset + currNumDays));

		daysTuple.days = daysTuple.days.concat(range(1, tailOffset+1));
		for (let i = 0; i < tailOffset; i++) {
			daysTuple.locked.push(true);
		}


		var msg = "month starts on " +  new MyDate(this.firstDate).getDay(true) + "\n";
		msg += "prev: " + prevNumDays + "\ncurr: " + currNumDays + "\n";
		msg += "headOffset: " + headOffset + "\ntailOffset: " + tailOffset + "\n";
		msg += "total days: " + totalDays + "\ntotal weeks: " + totalWeeks + "\n";
		msg += "days.length: " + daysTuple.days.length;
		// console.log(msg);
		// console.log(daysTuple.days);

		daysTuple.numWeeks = totalWeeks;
		return daysTuple;
	}
	getDateObject() {
		return this.date;
	}
	equals(other) {
		//only care if the month/year changes
		if (this.date === null && other === null) {
			return true;
		}
		if (this.date !== null || other !== null) {
			return false;
		}
		var otherDate = new Date(other);
		var monthEq = this.getMonth() === otherDate.getMonth();
		var yearEq = this.getYear() === otherDate.getYear();
		return monthEq && yearEq;
	}
}

var dateHandler = function(obj, event) {
	var matrixItem = event.target;
	var matrixHeader = matrixItem.parentNode;
	var rootElement = matrixHeader.parentNode;

	var fixedDate = {};
	fixedDate.month = obj.date.getMonth(true);
	fixedDate.day = matrixItem.innerHTML;
	fixedDate.year = obj.date.getYear(true);
	obj.callback(rootElement.getAttribute("id"), fixedDate);
};
var buttonHandler = function(obj, event) { 
	/*
	NOTE on partial function and .bind()
		all optional args at the front, non-bounded args should be last.
		so, event must be the last arg in handlers.
	*/
	let curr = obj.date;
	let y = curr.getYear(false);
	let m = curr.getMonth(false);
	let d = 1;
	
	var id = event.target.getAttribute("id");
	if (id.includes("footerLeft")) {
		obj.updateContents(new Date(y, m-1, d)); //year will auto update
	} else if (id.includes("footerRight")) {
		obj.updateContents(new Date(y, m+1, d)); //year will auto update
	}
}

class CalendarRenderer {
	static daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	constructor(id, root, date, callback) {
		this.id = id;

		this.root = root;
		this.root.setAttribute("style", containerStyle.root);
		this.date = new MyDate(date);

		this.callback = callback;

		this.dateHandler = dateHandler.bind(null, this);
		this.buttonHandler = buttonHandler.bind(null, this);

		this.htmlIsSet = false;
	}
	getElementById(id) {
		return document.getElementById(this.id + id);
	}
	setupHeader() {
		// console.log("setupHeader: making container")
		var container = document.createElement("div");
		container.setAttribute("style", containerStyle.header);
		container.setAttribute("id", this.id+"headerRoot")


		// console.log("setupHeader: making month");
		var month = document.createElement("div");
		month.innerHTML = "???";
		month.setAttribute("style", itemStyle.header);
		month.setAttribute("id", this.id+"headerMonth");
		container.appendChild(month);

		// console.log("setupHeader: making year");
		var year = document.createElement("div");
		year.innerHTML = "????";
		year.setAttribute("style", itemStyle.header);
		year.setAttribute("id", this.id+"headerYear")
		container.appendChild(year);

		return container;
	}
	setupMatrix() {
		var container = document.createElement("div");
		container.setAttribute("style", containerStyle.matrix);
		container.setAttribute("id", this.id+"matrixRoot");
		return container;
	}

	setupFooter() {
		var container = document.createElement("div");
		container.setAttribute("style", containerStyle.footer);
		container.setAttribute("id", this.id+"footerRoot");

		var leftButton = document.createElement("div");
		leftButton.innerHTML = "<";
		leftButton.setAttribute("style", itemStyle.footer_text);
		leftButton.setAttribute("id", this.id+"footerLeft");
		leftButton.addEventListener("click", this.buttonHandler, false);
		container.appendChild(leftButton);

		var rightButton = document.createElement("div");
		rightButton.innerHTML = ">";
		rightButton.setAttribute("style", itemStyle.footer_text);
		rightButton.setAttribute("id", this.id+"footerRight");
		rightButton.addEventListener("click", this.buttonHandler, false);
		container.appendChild(rightButton);

		return container;
	}
	setupHTML() {
		this.htmlIsSet = true;
		this.root.appendChild(this.setupHeader());
		// console.log("CalendarRenderer::setupHTML: Header Done.")

		this.root.appendChild(this.setupMatrix());
		// console.log("CalendarRenderer::setupHTML: Matrix Done.")

		this.root.appendChild(this.setupFooter());
		// console.log("CalendarRenderer::setupHTML: Footer Done.")
	}

	updateHeader() {
		// https://stackoverflow.com/questions/1643320/get-month-name-from-date/18648314#18648314
		var month = this.getElementById("headerMonth");
		month.innerHTML = this.date.getMonth(true);

		var year = this.getElementById("headerYear");
		year.innerHTML = this.date.getYear(true);
	}

	testHandler(elem) {
		var matrixItem = event.target;
		var matrixHeader = matrixItem.parentNode;
		var rootElement = matrixHeader.parentNode;

		var fixedDate = {};
		fixedDate.month = this.date.getMonth(true);
		fixedDate.day = matrixItem.innerHTML;
		fixedDate.year = this.date.getYear(true);
		this.callback(rootElement.getAttribute("id"), fixedDate);
	}
	updateMatrix() {
		/**
		NOTE: matrix items do NOT have id's. Use index and matrixRoot.children to access.
		**/
		var matrix = this.getElementById("matrixRoot");
		matrix.innerHTML = ""; //clear out old matrix.

		for (let i = 0; i < 7; i++) {
			var label = document.createElement("div");
			label.innerHTML = CalendarRenderer.daysLabels[i];
			label.setAttribute("style", itemStyle.matrix);
			matrix.appendChild(label);
		}

		var daysTuple = this.date.getDays();
		var days = daysTuple.days;
		var numWeeks = daysTuple.numWeeks;
		var locked = daysTuple.locked;
		for (let i = 0; i < days.length; i++) {
			var day = document.createElement("div");
			day.innerHTML = days[i].toString();	
			day.setAttribute("style", itemStyle.matrix);

			if (locked[i] === false) {
				day.addEventListener("click", this.dateHandler, false);
				day.style.backgroundColor = "darkgray"; //idk why this is LIGHTER than gray
			} else {
				day.style.backgroundColor = "gray"; 
			}

			matrix.appendChild(day);
		}
	}
	updateFooter() {

	}
	updateContents(date) {
		this.date.update(date);
		this.updateHeader();
		this.updateMatrix();
		this.updateFooter();
	}
	render(date) {
		// if (this.date.equals(date)) { 
		// 	// console.log("CalendarRenderer::Render: Old Date.")
		// 	return;
		// }
		if (! this.htmlIsSet) {
			// console.log("CalendarRenderer::Render: HTML NOT Set.")
			this.setupHTML();
		} else {
			// console.log("CalendarRenderer::Render: HTML Is Set.")
		}

		this.updateContents(date);
		console.log("contents updated.")
	}
}

/**
calendarFactory prevents conflicts in HTML element ids.
1. does not use id of calendar root. (user mistakes with duplicate ids can occur).
2. use counter which ensures uniqueness.
**/
var calendarFactory = {count:-1};
calendarFactory.create = function (calendarArgs) {
	this.count += 1;
	return new CalendarRenderer(this.count, ...calendarArgs);
}
class DatePicker {
	constructor(id, callback) {
		this.id = id;
		this.callback = callback;

		this.rootElement = document.getElementById(this.id);

		this.calendar = null; //must be instance (not static). o.w. uniqueness is not guaranteed.
	}
	render(date) {
		if (this.calendar === null) {
			var args = [this.rootElement, date, this.callback]
			this.calendar = calendarFactory.create(args);
		}
		console.log("rendering date: ", date.toString());
		this.calendar.render(date);
	}
}