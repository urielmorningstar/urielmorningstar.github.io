
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
	
	static attr (elm, attribute, defaultValue = null) {
		return elm.getAttribute (attribute) || defaultValue;
	}
	
	static set (elm, attribute, val) {
		elm.setAttribute (attribute, val);
	}
	
	static mark (elm, attrbiute) {
		elm.setAttribute (attribute, "");
	}
	
	static rem (elm, attribute) {
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
		ε.set (this.element, attribute, value);
		return this;
	}
	
	mark (markname) {
		ε.mark (this.element, markname);
		return this;
	}
	
	add (parent = document.body) {
		parent.appendChild (this.element);
		return this.element;
	}
	
	event (evt, callback) {
		this ["on" + evt] = callback;
	}
}

//

class φ {
	static entries = [];
	
	static loadFrom (url) {
		let xhr = new XMLHttpRequest ();
		xhr.open ("GET", url);
		xhr.setRequestHeader ("Cache-control", "no-cache, no-store, max-age=0");
		xhr.setRequestHeader ("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
		xhr.setRequestHeader ("Pragma", "no-cache");
		xhr.onload = function (data) {
			let respTxt = data.target.response;
			let xml = new DOMParser ().parseFromString (respTxt, "text/xml");
			
			console.log (xml);
			
			for (let entry of xml.querySelectorAll ("entry")) {
				let _name = ε.attr (entry, "name");
				let _key = ε.attr (entry, "key", _name.toLowerCase ());
				let _desc = entry.querySelector ("description").innerHTML;
				let _tags = [];
				
				for (let _t of entry.querySelectorAll ("tag")) _tags.push (_t.innerHTML);
				
				φ.entries.push ({
					title: _name,
					searchkey: _key,
					description: _desc,
					tags: _tags
				});
			}
		}
		xhr.send ();
	}
	
	constructor (entryData = {}) {
		this.title = entryData.title;
		this.searchkey = optional (obj, "searchkey", entryData.title);
		this.description = optional (obj, "description", null);
		this.tags = optional (obj, "tags", []);
		if (this.tags.constructor !== Array) this.tags = [ this.tags ];
		
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
