window.onscroll = function() {scrollFunction()};

setClausesInDiagram()

var resClausesClicked = 0
var lineConnections = []

function scrollFunction() {
	var btn = document.getElementById("btn_top");
	
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		btn.style.display = "block";
	} else {
		btn.style.display = "none";
	}
}

function scrollUp() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

function addTableRow(elId) {
	var table = document.getElementById(elId);
	
	if(elId === "table_input") {
		var lastRowIdx = table.rows.length - 2;
		var row = table.insertRow(lastRowIdx);
		var letter = String.fromCharCode(97 + lastRowIdx);
		
		var cell0 = row.insertCell(0);
		cell0.innerHTML = "<td><p contenteditable='false'>"+letter+"</p></td>";
		
		var cell1 = row.insertCell(1);
		cell1.innerHTML = "<td><p contenteditable='true' spellcheck='false'>enter fact here</p></td>";
		
		var cell2 = row.insertCell(2);
		cell2.innerHTML = "<td><button onclick='swapIcon(this)'><i class='fa fa-caret-left'></i></button></td>";
		
		var cell3 = row.insertCell(3);
		cell3.innerHTML = "<td><button onclick='deleteTableRow(\""+elId+"\")'><i class='fa fa-trash'></i></button></td>";
		
		addTableRow("table_formulas")
		addTableRow("table_skol")
		addTableRow("table_clauses")
		writeStatement();
	}
	else if(elId === "table_defs") {
		var lastRowIdx = table.rows.length - 2;
		var row = table.insertRow(lastRowIdx);
	
		var cell0 = row.insertCell(0);
		cell0.innerHTML = "<td><p contenteditable='true' spellcheck='false'>enter text here</p></td>";
		
		var cell1 = row.insertCell(1);
		cell1.innerHTML = "<td><button onclick='deleteTableRow(\""+elId+"\")'><i class='fa fa-trash'></i></button></td>";
	}
	else if(elId === "table_formulas" || elId === "table_skol" || elId === "table_clauses") {
		var lastRowIdx = table.rows.length - 1;
		var row = table.insertRow(lastRowIdx);
		var letter = String.fromCharCode(97 + lastRowIdx);
		var modalId = "modal_formulas";
		
		if(elId === "table_skol") {
			modalId = "modal_skol";
		} else if(elId === "table_clauses") {
			modalId = "modal_clauses";
		}
		
		var cell0 = row.insertCell(0);
		cell0.innerHTML = "<td><p contenteditable='false'>"+letter+"</p></td>";
		
		var cell1 = row.insertCell(1);
		cell1.innerHTML = "<td><p contenteditable='false' spellcheck='false'>enter text here</p></td>";
		
		var cell2 = row.insertCell(2);
		cell2.innerHTML = "<td><button onclick='openCloseRowEditing(this, \""+modalId+"\")'><i class='fa fa-pencil-square-o'></i></button></td>";
	}
}

function deleteTableRow(elId, cellId) {	
	var table = document.getElementById(elId);
	var numOfInputs = table.rows.length - getMinNumOfRows(elId);
	var el = event.target;
	
	if(numOfInputs <= getMinNumOfRows(elId)) {
		return
	}
	
	if(elId != "table_formulas" && 
	   elId != "table_skol" && 
	   elId != "table_clauses") {
		while(el.parentNode) {
			if(el.tagName === "TR") {
				var cellId = el.cells[0].firstChild.innerHTML
				el.remove();
				deleteTableRow("table_formulas", cellId)
				deleteTableRow("table_skol", cellId)
				deleteTableRow("table_clauses", cellId)
				
				break;
			}
			
			el = el.parentNode;
		}
	}
	else if(cellId != undefined || cellId != null) {
		for(var i = 0; i < table.rows.length; i++) {
			if(table.rows[i].cells[0].firstChild.innerHTML === cellId) {
				table.rows[i].remove();
			}
		}
	}
	
	if(elId === "table_input" || 
	   elId === "table_formulas" || 
	   elId === "table_skol" || 
	   elId === "table_clauses") {
		adjustInputId(elId);
	}
	
	writeStatement() 
}

function adjustInputId(elId) {
	var table = document.getElementById(elId);
	var numOfInputs = table.rows.length - getMinNumOfRows(elId);
	
	for(var i = 0, row; row = table.rows[i]; i++) {
		if(i < numOfInputs) {
			var letter = String.fromCharCode(97 + i);
			
			row.cells[0].innerHTML = "<td><p contenteditable='false'>"+letter+"</p></td>";
		}
	}
}

function swapIcon(el) {
	var elChild = el.firstChild;
	
	if(elChild.nodeName === "I") {
		var className = elChild.className;
		
		if(className == "fa fa-caret-left") {
			elChild.className = "fa fa-caret-right";
			writeStatement();
		} 
		else if(className == "fa fa-caret-right") {
			elChild.className = "fa fa-caret-left";
			writeStatement();
		}
		else if(className == "fa fa-square-o") {
			elChild.className = "fa fa-check-square-o";
		} 
		else if(className == "fa fa-check-square-o") {
			elChild.className = "fa fa-square-o";
		}
	}
}

function writeStatement() {
	var p = document.getElementById('statement');
	var statement = "";
	var left = [];
	var right = [];
	
	var parentDiv = document.getElementById('div_input');
	var icons = parentDiv.getElementsByTagName('i');
	
	for(var i = 0; i < icons.length; i++) {
		if(icons[i].className === "fa fa-caret-left") {
			var parentTr = icons[i].parentNode.parentNode.parentNode;
			var td = parentTr.cells[0];
			var id = td.getElementsByTagName('p')[0].innerHTML;
			left.push(id);
		} else if(icons[i].className === "fa fa-caret-right") {
			var parentTr = icons[i].parentNode.parentNode.parentNode;
			var td = parentTr.cells[0];
			var id = td.getElementsByTagName('p')[0].innerHTML;
			right.push(id);			
		}
	}
	
	for(var i = 0; i < left.length; i++) {
		statement += left[i];
		
		if(i != left.length-1) {
			statement += (" " + decodeHtmlCharCodes('&#8743;') + " ");
		}
	}
	
	statement += (" " + decodeHtmlCharCodes('&#8594;') + " ");
	
	for(var i = 0; i < right.length; i++) {
		statement += right[i];
		
		if(i != right.length-1) {
			statement += (" " + decodeHtmlCharCodes('&#8743;') + " ");
		}
	}
	
	p.innerHTML = statement;
}

function submitInputs(elId) {
	var div = document.getElementById(elId);		
	
	if(elId === "div_input") {
		var nextDiv = document.getElementById("div_defs");
		nextDiv.style.pointerEvents = "auto";
		nextDiv.style.opacity = "1";
		
		var table = document.getElementById("table_defs");
		table.style.display = "block";
		
		
		addTableRow('table_defs')
		
		guessTableValues("table_defs", table);
	} else if(elId === "div_defs") {
		var nextDiv = document.getElementById("div_formulas");
		nextDiv.style.pointerEvents = "auto";
		nextDiv.style.opacity = "1";
		
		var table = document.getElementById("table_formulas");
		table.style.display = "block";
		
		guessTableValues("table_formulas", table);
	}
}

function guessTableValues(tableId, table) {
	if(tableId === "table_defs") {
		var ps = table.getElementsByTagName('p');
		var values = ["Is the universe all dragons?", "H(x): x = happy", "F(x): x = fly", "G(x): x = green"];
		
		for(var i = 0; i < ps.length; i++) {
			ps[i].innerHTML = values[i];
		}
	} else if(tableId === "table_formulas") {
		var firstTable = document.getElementById("table_input");
		var firstPs = firstTable.getElementsByTagName('p');
		
		var ps = table.getElementsByTagName('p');
		
		for(var i = 1; i < ps.length; i+=2) {
			ps[i].innerHTML = firstPs[i].innerHTML;
		}
	}
}

function getMinNumOfRows(tableName) {
	if(tableName === "table_input") {
		return 2;
	}
	else if(tableName === "table_defs" || 
			tableName === "table_formulas" || 
			tableName === "table_skol" || 
			tableName === "table_clauses") {
		return 1;
	}
}

function openCloseRowEditing(el, elId) {
	var modal = document.getElementById(elId);
	var span = document.getElementById(elId + "_close");
	var p = document.getElementById(elId + "_p");
	
	modal.style.display = "block";
	
	var pText = el.parentNode.parentNode.parentNode.getElementsByTagName('p')[1]
	p.innerHTML = pText.innerHTML;
	
	var newText = document.createElement("div");
	newText.innerHTML = "<p id='modal_formulas_p_input' contenteditable='true' spellcheck='false'></p>"+
					    "<div id='toolbox'>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&not;</button>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&#8743;</button>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&#8744;</button>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&#8707;</button>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&#8704;</button>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&#8594;</button>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&#40;</button>"+
						"<button class='btn_logic_sym' onclick='updateModalText(this)'>&#41;</button>"+
						"<button class='btn_logic_sym_pred' onclick=''updateModalText(this)>H</button>"+
						"<button class='btn_logic_sym_pred' onclick='updateModalText(this)'>F</button>"+
						"<button class='btn_logic_sym_pred' onclick='updateModalText(this)'>G</button>"+
						"<button class='btn_logic_sym_pred' onclick='updateModalText(this)'>C</button>"+
						"<button class='btn_logic_sym_pred' onclick='updateModalText(this)'>x</button>"+
						"<button class='btn_logic_sym_pred' onclick='updateModalText(this)'>y</button>"+
						"</div>"
	
	modal.getElementsByTagName('div')[0].appendChild(newText);

	span.onclick = function() {
		modal.style.display = "none";
	}
}

function updateModalText(el) {
	var p = document.getElementById("modal_formulas_p_input");
	
	if(el.innerHTML === 'H' || el.innerHTML === 'F' || el.innerHTML === 'G'){
		p.innerHTML += (el.innerHTML + "(x)");
	} else if(el.innerHTML === 'C'){
		p.innerHTML += (el.innerHTML + "(x,y)");
	} else {
		p.innerHTML += decodeHtmlCharCodes(el.innerHTML);
	}
}

function setClausesInDiagram() {
	var xPos = 15, yPos = 15;
	var space = 21;
	var numOfClauses = 4;
	
	var divOfClauses = document.getElementById("div_res_playgrd");
	
	for(var i = 0; i < numOfClauses; i++) {
		var el = document.getElementById("res_clause_"+i);
		el.style.left = xPos+"px";
		el.style.top = yPos+"px";
		
		xPos += (el.clientWidth + space);
		
		allowDrag(el, divOfClauses);
		setConnectorClick(el);
	}
}

function allowDrag(el, boundsEl) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	
	el.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		padding = 0
		
		if((el.offsetTop - pos2) >= padding && 
		   (el.offsetTop - pos2 + el.clientHeight) <= boundsEl.clientHeight - padding) {
			el.style.top = (el.offsetTop - pos2) + "px";
		}
		
		if((el.offsetLeft - pos1) >= padding && 
		   (el.offsetLeft - pos1 + el.clientWidth) <= boundsEl.clientWidth - padding) {
			el.style.left = (el.offsetLeft - pos1) + "px";
		}
		
		updateLinesOnDrag(el, (el.offsetLeft - pos1), (el.offsetTop - pos2));
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

function setConnectorClick(el) {
	var iconEl = el.getElementsByTagName('i')[0];
	
	iconEl.addEventListener('click', clickHandler);
	
	function clickHandler(){
		if(iconEl.style.color === "black" || iconEl.style.color === "") {
			iconEl.style.color = "cadetblue";
			resClausesClicked++;
			if(resClausesClicked == 2) {
				resClausesClicked = 0;
				checkResolvent(this);
			}
		} else {
			iconEl.style.color = "black";
			if(resClausesClicked > 0) {
				resClausesClicked--;
			}
		}
	}
}

function setCheckerClick(el, ansArr, iconEls, lineEls) {
	var iconEl = el.getElementsByTagName('i')[0];
	var pEl = el.getElementsByTagName('p')[0];
	var resolvedArr = [decodeHtmlCharCodes('&#9633;')];
	
	iconEl.addEventListener('click', clickHandler);
	
	function clickHandler(){
		var input = pEl.innerText.replace(/\s/g, '').split(",");
		
		for(var i = 0; i < ansArr.length; i++) {
			if(arraysEqual(input, ansArr[i]) || (ansArr[0].length === 0 && arraysEqual(input, resolvedArr))) {
				iconEl.className = "fa fa-check-circle";
				iconEl.style.color = "green";
				el.style.border = "1px solid green"
				el.style.color = "green"
				
				changeColorOfEls(iconEls, "green");
				changeBackgroundOfEls(lineEls, "green");
			
				setTimeout(function() {
					iconEl.className = "fa fa-plus-circle icon-clause-connect";
					iconEl.style.color = "black";
					el.style.border = "1px solid black"
					el.style.color = "black"
					el.className = "res_clause"
					
					changeColorOfEls(iconEls, "black");
					changeBackgroundOfEls(lineEls, "black");
					
					iconEl.removeEventListener('click', clickHandler);
					setConnectorClick(el);
					allowDrag(el, document.getElementById("div_res_playgrd"));
				}, 1000);
			} else{
				iconEl.className = "fa fa-times-circle";
				iconEl.style.color = "red";
				el.style.border = "1px solid red"
				el.style.color = "red"
				
				changeColorOfEls(iconEls, "red");
				changeBackgroundOfEls(lineEls, "red");
					
				setTimeout(function() {
					iconEl.className = "fa fa-check-circle icon-clause-connect";
					iconEl.style.color = "cadetblue";
					el.style.border = "1px solid cadetblue"
					el.style.color = "cadetblue"
					
					changeColorOfEls(iconEls, "cadetblue");
					changeBackgroundOfEls(lineEls, "cadetblue");
				}, 1000);
			}
			
			break;
		}
	}
}

function changeColorOfEls(els, color) {
	for(var i = 0; i < els.length; i++) {
		els[i].style.color = color;
	}
}

function changeBackgroundOfEls(els, color) {
	for(var i = 0; i < els.length; i++) {
		els[i].style.backgroundColor = color;
	}
}

function arraysEqual(a1, a2) {
	var a1Str = JSON.stringify(a1.sort());
	var a2Str = JSON.stringify(a2.sort());
	
    return a1Str === a2Str;
}

function checkResolvent(el) {
	var divs = document.getElementsByClassName("res_clause");
	var clauses = [];
	var cadetblueIcons = [];
	var cadetblueDivs = []
	
	for(var i = 0; i < divs.length; i++) {
		var div = divs[i];
		var iconEl = div.getElementsByTagName('i')[0];
		
		if(iconEl.style.color === "cadetblue") {
			clauses.push(div.firstChild.textContent);
			cadetblueIcons.push(iconEl);
			cadetblueDivs.push(div);
		}
	}
	
	if(clauses.length == 2) {
		resolventsArr = findResolvent(clauses)
		
		if(resolventsArr.length == 0) {
			cadetblueIcons[0].style.color = "red";
			cadetblueIcons[1].style.color = "red";
			
			setTimeout(function() {
				cadetblueIcons[0].style.color = "black";
				cadetblueIcons[1].style.color = "black";
			}, 1000);
		} else {
			var parentDiv = document.getElementById("div_res_playgrd");
			
			var resolventDiv = document.createElement("div");
			resolventDiv.className = "res_clause res_clause_editable";
			resolventDiv.innerHTML = "<span><p contenteditable='true' spellcheck='false'>?</p></span><div class='res_clause_connect'><i class='fa fa-check-circle icon-clause-connect' aria-hidden='true'></i></div></div>";
			
			parentDiv.appendChild(resolventDiv);
			
			var icon0Left = getOffset(parentDiv, cadetblueIcons[0]).left;
			var icon1Left = getOffset(parentDiv, cadetblueIcons[1]).left;
			var icon0Top = getOffset(parentDiv, cadetblueDivs[0]).top;
			var icon1Top = getOffset(parentDiv, cadetblueDivs[1]).top;
			var iconWidth = cadetblueIcons[0].clientWidth;
			var iconHeight = cadetblueIcons[0].clientHeight;
			var resolventDivWidth = resolventDiv.clientWidth;
			var resolventDivHeight = resolventDiv.clientHeight;
			
			var xPos = ((icon0Left + icon1Left) / 2) - (resolventDivWidth / 2);
			var yPos = icon0Top + resolventDivHeight + 20;
			
			if(icon1Top > icon0Top) {
				yPos = icon1Top + resolventDivHeight + 20;
			}
			
			resolventDiv.style.left = xPos + "px";
			resolventDiv.style.top = yPos + "px";
			
			var line1 = document.createElement("div");
			line1.className = "res_line";
			parentDiv.appendChild(line1);
			connectDivsWithLine(cadetblueDivs[0], resolventDiv, line1);
			lineConnections.push([line1, cadetblueDivs[0], resolventDiv])
			
			var line2 = document.createElement("div");
			line2.className = "res_line";
			parentDiv.appendChild(line2);
			connectDivsWithLine(cadetblueDivs[1], resolventDiv, line2);
			lineConnections.push([line2, cadetblueDivs[1], resolventDiv])
			
			setCheckerClick(resolventDiv, resolventsArr, [cadetblueIcons[0], cadetblueIcons[1]], [line1, line2]);
		}
	}
}

function updateLinesOnDrag(el, elLeft, elTop) {
	for(var i = 0; i < lineConnections.length; i++) {
		var line = lineConnections[i][0];
		var div1 = lineConnections[i][1];
		var div2 = lineConnections[i][2];
		
		if(el === div1 || el === div2) {
			connectDivsWithLine(div1, div2, line);
		}
	}
}

function addNotSymbolToEl(parentElId) {
	if(parentElId === "div_res_playgrd") {
		var div = document.getElementsByClassName("res_clause_editable");
		var p = div[0].getElementsByTagName('p')[0];
		p.innerText = p.innerText + decodeHtmlCharCodes('&#172;');
	}
}

function addBoxSymbolToEl(parentElId) {
	if(parentElId === "div_res_playgrd") {
		var div = document.getElementsByClassName("res_clause_editable");
		var p = div[0].getElementsByTagName('p')[0];
		p.innerText = decodeHtmlCharCodes('&#9633;');
	}
}

function clearResPlaygrd(parentElId) {
	var div = document.getElementById(parentElId);
	
	while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
	
	div.innerHTML =
		"<div id='toolbox'>"+
			"<button id='btn_not' onclick='addNotSymbolToEl(\'div_res_playgrd\')'>&not;</button></td>"+
			"<button id='btn_box' onclick='addBoxSymbolToEl(\'div_res_playgrd\')'>&#9633;</button></td>"+
			"<button id='btn_clear' onclick='clearResPlaygrd(\'div_res_playgrd\')'>&#10227;</button></td>"+
		"</div>"+
		"<div id='res_clause_0' class='res_clause'><span>A, &not;B, &not;C</span>"+
			"<div class='res_clause_connect'><i class='fa fa-plus-circle icon-clause-connect' aria-hidden='true'></i></div>"+
		"</div>"+
		"<div id='res_clause_1' class='res_clause'><span>Z, &not;A</span>"+
			"<div class='res_clause_connect'><i class='fa fa-plus-circle icon-clause-connect' aria-hidden='true'></i></div>"+
		"</div>"+
		"<div id='res_clause_2' class='res_clause'><span>A, B, C</span>"+
			"<div class='res_clause_connect'><i class='fa fa-plus-circle icon-clause-connect' aria-hidden='true'></i></div>"+
		"</div>"+
		"<div id='res_clause_3' class='res_clause'><span>A, Z, B</span>"+
			"<div class='res_clause_connect'><i class='fa fa-plus-circle icon-clause-connect' aria-hidden='true'></i></div>"+
		"</div>"+
		"<div id='footer'>"+
			"<button id='btn_next' onclick=''>next</button></td>"+
		"</div>"
	
	setClausesInDiagram()
	resClausesClicked = 0
	lineConnections = []
}

function connectDivsWithLine(div1, div2, line){
	/*resource: https://stackoverflow.com/questions/19382872/how-to-connect-html-divs-with-lines */
	var div1Top = div1.offsetTop + div1.offsetHeight - 1;
	var div2Top = div2.offsetTop + 1;
	var div1Left = div1.offsetLeft + div1.offsetWidth / 2;
	var div2Left = div2.offsetLeft + div2.offsetWidth / 2;

	var ca = Math.abs(div2Top - div1Top);
	var co = Math.abs(div2Left - div1Left);
	var height = Math.sqrt((ca * ca) + (co * co));
	var angle = 180 / Math.PI * Math.acos(ca / height);

	if(div2Top > div1Top){
		var top = (div2Top - div1Top) / 2 + div1Top;
	} else{
		var top = (div1Top - div2Top) / 2 + div2Top;
	}
	
	if(div2Left > div1Left){
		var left = (div2Left - div1Left) / 2 + div1Left;
	} else{
		var left = (div1Left - div2Left) / 2 + div2Left;
	}

	if((div1Top < div2Top && div1Left < div2Left) || 
	   (div1Top < div1Top && div2Left < div1Left) || 
	   (div1Top > div2Top && div1Left > div2Left) || 
	   (div2Top > div1Top && div2Left > div1Left)){
		angle *= -1;
	}
	
	top -= height / 2;

	line.style["-webkit-transform"] = 'rotate(' + angle + 'deg)';
	line.style["-moz-transform"] = 'rotate(' + angle + 'deg)';
	line.style["-ms-transform"] = 'rotate(' + angle + 'deg)';
	line.style["-o-transform"] = 'rotate(' + angle + 'deg)';
	line.style["-transform"] = 'rotate(' + angle + 'deg)';
	line.style.top = top + 'px';
	line.style.left = left + 'px';
	line.style.height = height + 'px';
}

function getOffset(parentEl, childEl) {
    var parentPos = parentEl.getBoundingClientRect();
    var childPos = childEl.getBoundingClientRect();
    var relativePos = {};

	relativePos.top = childPos.top - parentPos.top,
	relativePos.right = childPos.right - parentPos.right,
	relativePos.bottom = childPos.bottom - parentPos.bottom,
	relativePos.left = childPos.left - parentPos.left;

	return relativePos
}

function decodeHtmlCharCodes(str) { 
	return str.replace(/(&#(\d+);)/g, function(match, capture, charCode) {
		return String.fromCharCode(charCode);
	});
}

function findResolvent(clauses) {
	var clause1 = clauses[0].replace(/\s/g, '').split(",");
	var clause2 = clauses[1].replace(/\s/g, '').split(",");
	var notToken = decodeHtmlCharCodes('&#172;');
	var canResolveArr = []
	var answersArr = []
	
	for(var i = 0; i < clause1.length; i++) {
		var val = decodeHtmlCharCodes(clause1[i]);
		var neg = decodeHtmlCharCodes(clause1[i]);
		
		if(!neg.includes(notToken)) {
			neg = notToken + "" + neg;
		} else {
			neg = neg.substring(1)
		}
		
		for(var j = 0; j < clause2.length; j++) {
			var val2 = decodeHtmlCharCodes(clause2[j]);
			
			if(val2 === neg) {
				canResolveArr.push([val, val2]);
			}
		}
	}
	
	for(var i = 0; i < canResolveArr.length; i++) {
		answersArr.push(findAnswers(clause1, clause2, canResolveArr[i]));
	}
	
	return answersArr;
}

function findAnswers(c1, c2, arr) {
	c1 = c1.filter(e => e !== arr[0]);
	c2 = c2.filter(e => e !== arr[1]);
	
	return [...new Set(c1.concat(c2))]
}
