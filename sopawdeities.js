var _ = {
	"searchentries": [
		{
			"title": "Aphrodite",
			"key": "aphrodite"
			"description": "A deity from hellenism that rules over the domain of love, beauty, physical attraction, and sexuality."
			"tags": [ "Deity", "Hellenism" ]
		}
	]
};

if (typeof ENTRY_DUMP === 'undefined') ENTRY_DUMP = _.searchentries;
else ENTRY_DUMP.push (..._.searchentries);
