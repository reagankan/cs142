class TableTemplate {
	static examineLayout(id, dict, columnName) {
		console.log("id: ", id);
		var table = document.getElementById(id);
		for (let row of table.rows) {
			console.log(row);
			for (let cell of row.cells) {
				console.log(cell.tagName);
			}
			console.log("Num cells: ", row.cells.length);
		}
		console.log("num rows including header row: ", table.rows.length, table.rows);
	}
	static fillIn(id, dict, columnName) {
		// console.log("columnName: ", columnName);

		var table = document.getElementById(id);
		table.style.visibility = "visible";

		var templateFiller = new Cs142TemplateProcessor();

		//fill in header row.
		for (let cell of table.rows[0].cells) {
			templateFiller.template = cell.innerHTML;
			cell.innerHTML = templateFiller.fillIn(dict);
		}


		//fill in appropriate column(s)
		var fillOneColumn = columnName !== undefined;

		//look for columnName if specified.
		var colIndex = -1;
		if (fillOneColumn) {
			for (let c = 0; c < table.rows[0].cells.length; c++) {
				if (table.rows[0].cells[c].innerHTML === columnName) {
					colIndex = c;
					// console.log("FOUND (", columnName, "): ", table.rows[0].cells[c].innerHTML);
					break;
				}
			}

			if (colIndex === -1) {
				console.log("ERROR: did not find ", columnName, "in table!!!");
				return;
			}
		}

		//fill in appropriate column(s)
		for (let row of table.rows) {
			for (let c = 0; c < row.cells.length; c++) {
				if (fillOneColumn) {
					if (c === colIndex) {
						let cell = row.cells[c];
						templateFiller.template = cell.innerHTML;
						cell.innerHTML = templateFiller.fillIn(dict);
					}
				} else {
					let cell = row.cells[c];
					templateFiller.template = cell.innerHTML;
					cell.innerHTML = templateFiller.fillIn(dict);
				}
			}
		}
	}
}