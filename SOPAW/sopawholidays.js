var _ = {
	"searchentries": [
		{
			"title": "Samhain",
			"key": "samhain",
			"description": "A holiday.",
			"tags": [ "Wheel of the Year", "Sabbat" ]
		}
	]
};

if (typeof ENTRY_DUMP === 'undefined') ENTRY_DUMP = _.searchentries;
else ENTRY_DUMP.push (..._.searchentries);
