
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

		Σ.searchBar = new ε("input")
			.id ("searchkey")
			.attr ("type", "text")
			.attr ("placeholder", "Search...")
			.event ("change", Σ.searchFromBar)
			.event ("keydown", Σ.searchFromBar)
			// .event ("beforeinput", Σ.searchFromBar)
			// .event ("input", Σ.searchFromBar)
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
		
		if (this.link != null) {
			elmHAbuilder.event ("click", () => {
				window.open (this.link).focus ();
			});
		}
		
		let elmHA = elmHAbuilder.add (elmH);

		if (this.tags.length > 0) {
			for (var i = 0; i < this.tags.length; i++) {
				if (i != 0) new ε("span").content(", ").add(elmM);
				let tag = this.tags [i];

				new ε("a")
					.content (tag)
					.attr ("href", "#")
					.mark ("tag-link")
					.event ("click", () => {
						Σ.search ("#" + tag);
					})
					.add (elmM);
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
	static RX_TAG = /#([^#"\s]+)/g;
	static RX_DESC = /"([^"]+)"/g;
	static RX_WHITESPACE = /\s+/g;

	static searchBar;
	static searchFromBar () { Σ.search (Σ.searchBar.value, false); }

	static search (query, updateSearchbar = true) {
		let tagSearches = [...query.matchAll (Σ.RX_TAG)].map ((val) => val[1]);
		query = query.replaceAll (Σ.RX_TAG, "");
		let descSearches = [...query.matchAll (Σ.RX_DESC)].map ((val) => val[1]);
		query = query.replaceAll (Σ.RX_DESC, "");
		let keySearch = query.replaceAll (Σ.RX_WHITESPACE, " ");

		for (var entryElm of ε.$ ("div.searchentrywrapper", true)) {
			let entryKey = ε.attr (entryElm, "searchkey");
			let entryTags = ε.attr (entryElm, "tags");
			let entryDesc = ε.$ ("p", false, entryElm);

			if (!entryKey.includes (keySearch)) continue;
			if (false in tagSearches.map ((val) => entryTags.includes (val))) continue;
			if (false in descSearches.map ((val) => entryDesc.includes (val))) continue;
		}

		// console.log (keySearch);
		if (updateSearchbar) Σ.searchBar.value = query;
	}

}

let databases = ε.attr (document.currentScript, "databases", "").split (" ");
let unloaded = [...databases];

let head = ε.$ ("head");
for (var db of databases) {
	let dbURL = `https://urielmorningstar.github.io/SOPAW/${db}.js`;

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
