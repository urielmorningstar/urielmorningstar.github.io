
// Object + Array Manipulation (Utils)

function optional (obj, key, defaultValue = null) {
	return obj[key] || null;
}

function predicate (obj, key, callback, defaultValue = null) {
	if (key in obj) return callback (obj[key]);
	else return defaultValue;
}

function removeItem (arr, val) {
	while (true) {
		let index = arr.indexOf (val);
		if (index === -1) break;
		else arr.splice (index, 1);
	}
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
	
	static mark (elm, attribute) {
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
		this.element.addEventListener (evt, callback);
		return this;
	}
}

//

class φ {
	static searchEntryContainer = null;
	static entries = [];
	
	static loadEntries () {
		for (var entry of ENTRY_DUMP) new φ (entry);
		φ.entries.sort ((a, b) =>
			a.title.toLowerCase ().localeCompare (b.title.toLowerCase ()));

		new ε("p")
			.content ("To use the following search, you can search by entry title, by entry tags (using a #), and things in an entry's description (using \"...\").")
			.mark ("help-text")
			.add();
		
		Σ.searchBar = new ε("input")
			.id ("searchkey")
			.attr ("type", "text")
			.attr ("placeholder", "Search...")
			.event ("change", Σ.searchFromBar)
			.event ("keydown", (evt) => {
				var text0 = evt.srcElement.value;
				var text1 = text0;
				var i0 = evt.srcElement.selectionStart;
				var i1 = evt.srcElement.selectionEnd;
			
				if (i0 != i1) return;
			
				if (evt.key == "Backspace") {
					if (text0 [i0] == '"') {
						text1 = text0.substring (0, i0 - 1) + text0.substring (i0 + 1, text0.length);
						evt.preventDefault ();
						evt.target.value = text1;
						evt.target.selectionStart = i0 - 1;
						evt.target.selectionEnd = i0 - 1;
					}
				}
				
				Σ.searchFromBar ();
			})
			.event ("keypress", (evt) => {
				if (evt.key == '"') {
					var text0 = evt.srcElement.value;
					var text1 = text0;
					var i0 = evt.srcElement.selectionStart;
					var i1 = evt.srcElement.selectionEnd;
			
					var qtCt = 0;
					for (var char of text0) qtCt += (char == '"' ? 1 : 0);
			
					if (i0 == i1) {
						if (text0 [i0] == '"') {
							evt.preventDefault ();
							evt.target.selectionStart = i0 + 1;
						} else if (qtCt % 2 == 0 && text0 [i0 - 1] != '"') {
							text1 = text0.substring (0, i0) + '""' + text0.substring (i0, text0.length);
							evt.preventDefault ();
							evt.target.value = text1;
							evt.target.selectionStart = i0 + 1;
							evt.target.selectionEnd = i0 + 1;
						}
					} else {
						text1 = text0.substring (0, i0) + '"' + text0.substring (i0, i1) + '"' + text0.substring (i1, text0.length);
						evt.preventDefault ();
						evt.target.value = text1;
						evt.target.setSelectionRange (i0 + 1, i1 + 1);
					}
				}
				
				Σ.searchFromBar ();
			})
			// .event ("beforeinput", Σ.searchFromBar)
			.event ("input", Σ.searchFromBar)
			.event ("paste", Σ.searchFromBar)
			.add ();

		for (var entry of φ.entries) entry.createElement ();
	}
	
	constructor (entryData = {}) {
		this.title = entryData.title;
		this.searchkey = optional (entryData, "key", entryData.title);
		this.description = optional (entryData, "description", null);
		this.tags = optional (entryData, "tags", []);
		this.link = optional (entryData, "link", null);
		
		φ.entries.push (this);
	}
	
	createElement () {
		if (φ.searchEntryContainer == null) {
			φ.searchEntryContainer = ε.$ ("div#searchentries");
			if (φ.searchEntryContainer == null) φ.searchEntryContainer = new ε("div")
				.id ("searchentries")
				.add ();
		}

		let elmW = new ε("div")
		.cls ("searchentrywrapper")
		.mark ("visible")
		.attr ("searchkey", this.searchkey)
		.attr ("tags", this.tags.join(";"))
		.add (φ.searchEntryContainer);
		
		let elmM = new ε("div")
		.cls ("searchentry")
		.add (elmW);
		
		let elmH = new ε("h1")
		.add (elmM);
		
		let elmHAbuilder = new ε("a")
		.attr ("href", "#")
		.mark ("title-link")
		.content (this.title)
		if (this.link != null) elmHAbuilder.attr ("href", this.link);
		let elmHA = elmHAbuilder.add (elmH);

		if (this.tags.length > 0) {
			let elmT = new ε("h2").add (elmM);
			for (var i = 0; i < this.tags.length; i++) {
				if (i != 0) new ε("span").content(", ").add(elmT);
				let tag = this.tags [i];

				new ε("span")
					.content (tag)
					.attr ("href", "#")
					.mark ("tag-link")
					.event ("click", () => {
						Σ.search ("#" + tag);
					})
					.add (elmT);
			}
		}

		if (this.description != null) {
			new ε("hr").add (elmM);

			let elmP = new ε("p")
			.content (this.description)
			.add (elmM);
		}
	}
}

class Σ {
	static RX_TAG = /#([^#"\s]*)/g;
	static RX_DESC = /"([^"]*)"/g;
	static RX_WHITESPACE = /\s+/g;

	static searchBar;
	static searchFromBar () { Σ.search (Σ.searchBar.value, false); }

	static search (query, updateSearchbar = true) {
		let tagSearches = [...query.matchAll (Σ.RX_TAG)].map ((val) => val[1]).map ((val) => val.toLowerCase ());
		query = query.replaceAll (Σ.RX_TAG, "");
		let descSearches = [...query.matchAll (Σ.RX_DESC)].map ((val) => val[1]).map ((val) => val.toLowerCase ());
		query = query.replaceAll (Σ.RX_DESC, "");
		let keySearch = query.replaceAll (Σ.RX_WHITESPACE, " ").toLowerCase ();

		// console.log (tagSearches, descSearches, keySearch);

		for (var entryElm of ε.$ ("div.searchentrywrapper", true)) {
			let entryKey = ε.attr (entryElm, "searchkey").toLowerCase ();
			let entryTags = ε.attr (entryElm, "tags").toLowerCase ();
			let entryDesc = ε.$ ("p", false, entryElm).innerHTML.toLowerCase ();
			// console.log (entryElm, entryTags, entryDesc, entryKey);

			let flag = true;

			// console.log (!entryKey.includes (keySearch));
			// console.log (tagSearches.map ((val) => entryTags.includes (val)));
			// console.log (descSearches.map ((val) => entryDesc.includes (val)));

			let t1 = tagSearches.map ((val) => entryTags.includes (val));
			let t2 = descSearches.map ((val) => entryDesc.includes (val));

			if (!entryKey.includes (keySearch)) flag = false;
			if (t1.includes (false) || t1 == []) flag = false;
			if (t2.includes (false) || t2 == []) flag = false;

			if (flag) ε.mark (entryElm, "visible");
			else ε.rem (entryElm, "visible");
		}

		let rcq = [query];
		rcq.push (...(tagSearches.map ((val) => "#" + val)));
		rcq.push (...(descSearches.map ((val) => '"' + val + '"')));

		if (updateSearchbar) Σ.searchBar.value = rcq.join (" ");
	}

}

let databases = ε.attr (document.currentScript, "databases", "").split (" ");
let unloaded = [...databases];

let head = ε.$ ("head");
for (var db of databases) {
	let dbURL = `https://urielmorningstar.github.io/SOPAW/dictionaries/${db}.js`;

	let dbScript = new ε("script")
		.attr ("src", dbURL)
		.attr ("database-name", db)
		.mark ("database-script")
		.event ("load", (evt) => {
			let dbName = ε.attr (evt.target, "database-name");
			removeItem (unloaded, dbName);
			if (unloaded.length == 0) φ.loadEntries ();
		})
		.add (head);
}
