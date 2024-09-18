
// Object Manipulation (Utils)

function optional (obj, key, defaultValue = null) {
	return obj[key] || null;
}

function predicate (obj, key, callback, defaultValue = null) {
	if (key in obj) return callback (obj[key]);
	else return defaultValue;
}

// Element Manipulation (Utils)

class ε {
	static $ (sel, multi = false, target = document) {
		if (multi) return [...target.querySelectorAll (sel)];
		else return target.querySelector (sel) || null;
	}
	
	static Attr (elm, attribute, defaultValue = null) {
		return elm.getAttribute (attribute) || defaultValue;
	}
	
	static Set (elm, attribute, val) {
		elm.setAttribute (attribute, val);
	}
	
	static Mark (elm, attribute) {
		elm.setAttribute (attribute, "");
	}
	
	static Rem (elm, attribute) {
		elm.removeAttribute (attribute);
	}
	
	constructor (tag) {
		this.element = document.createElement (tag);
		this.tag = tag;
	}
	
	content (content) {
		this.element.innerHTML = content;
		return this;
	}
	
	id (id) {
		this.element.id = id;
		return this;
	}
	
	value (value) {
		this.element.value = value;
		return this;
	}
	
	cls (clsData = []) {
		if (clsData.constructor === Array) clsData.forEach (this.element.classList.add);
		else this.element.classList.add (clsData);
		return this;
	}
	
	attr (attribute, value = "") {
		ε.Set (this.element, attribute, value);
		return this;
	}
	
	mark (markname) {
		ε.Mark (this.element, markname);
		return this;
	}
	
	add (parent = document.body) {
		parent.appendChild (this.element);
		return this.element;
	}
	
	event (evt, callback) {
		this.element.addEventListener (evt, callback);
		return this;
	}
}

//

class φ {
	static entries = [];

	static pushEntry (entryData = {}) {
		φ.entries.push (new φ (entryData));
	}
	
	static loadEntries (url) {
		// let xhr = new XMLHttpRequest ();
		// xhr.open ("GET", url);
		// xhr.setRequestHeader ("Cache-control", "no-cache, no-store, max-age=0");
		// xhr.setRequestHeader ("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
		// xhr.setRequestHeader ("Pragma", "no-cache");
		// xhr.onload = function (data) {
		// 	let respTxt = data.target.response;
		// 	let xml = new DOMParser ().parseFromString (respTxt, "text/xml");
			
		// 	console.log (xml);
			
		// 	for (let entry of xml.querySelectorAll ("entry")) {
		// 		let _name = ε.Attr (entry, "name");
		// 		let _key = ε.Attr (entry, "key", _name.toLowerCase ());
		// 		let _desc = entry.querySelector ("description").innerHTML;
		// 		let _tags = [];
				
		// 		for (let _t of entry.querySelectorAll ("tag")) _tags.push (_t.innerHTML);
				
		// 		φ.pushEntry ({
		// 			title: _name,
		// 			searchkey: _key,
		// 			description: _desc,
		// 			tags: _tags
		// 		});
		// 	}
		// }
		// xhr.send ();

	}
	
	constructor (entryData = {}) {
		this.title = entryData.title;
		this.searchkey = optional (obj, "key", entryData.title);
		this.description = optional (obj, "description", null);
		this.tags = optional (obj, "tags", []);
		
		φ.entries.push (this);
	}
	
	createElement () {
		let elmW = ε("div")
		.cls ("searchentrywrapper")
		.mark ("visible")
		.attr ("searchkey", this.searchkey)
		.attr ("tags", this.tags.join(";"))
		.add ();
		
		let elmM = ε("div")
		.cls ("searchentry")
		.add (elmW);
		
		let elmH = ε("h1")
		.add (elmM);
		
		let elmHA = ε("a")
		.attr ("href", "")
		.event ("click", () => { console.log ("A"); })
		.add (elmH);
	}
}

let databases = ε.Attr (document.currentScript, "databases", "").split (" ");
let loaded = databases.map ((val) => false);

let head = document.querySelector ("head");
for (var db of databases) {
	let dbURL = `https://urielmorningstar.github.io/SOPAW/${db}.js`;

	let dbScript = new ε("script")
					.attr ("src", dbURL)
					.mark ("database-script")
					.event ("load", (evt) => {
						console.log (evt);
					})
					.add (head);
}
