var m = require('mithril');
var SetShares = require('./components/shares');
var CalcBreakpoints = require('./components/breakpoints');

var app = document.getElementById('app');

var DataStruct = {
	'preferred': {},
	'common': {},
	'options': {},
	'warrants': {},
	'others': {},
	'fd': 0
};
var Sequence = [];
var OrderedLookup = {};

var Breakpoints = [];
var PreferredRanks = {};

// var claimsLookup = {};

var DataSet = {
	data: DataStruct,
	sequence: Sequence,
	lookup: OrderedLookup,
	breakpts: Breakpoints,
	ranks: PreferredRanks,
	// claimsLookup: claimsLookup, 
	prefAll: m.prop(0)
};


var TopLevel = {
	view: function() {
		return m('div', [
			m.component(SetShares, {group: DataSet}), 
			m.component(CalcBreakpoints, {group: DataSet})
		])
	}
};

m.mount(app, TopLevel);