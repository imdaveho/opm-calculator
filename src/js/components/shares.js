var m = require('mithril');
var _ = require('lodash');
var Velocity = require('velocity-animate');

var ButtonBar = require('./widgets/buttonbar');
var Accordion = require('./widgets/accordion');
var StockForm = require('./widgets/stockform');

var FormMap = {
	'preferred': [],
	'common': [],
	'warrants': [],
	'options': [],
	'others': []
};

var formLookup = m.prop(null);
var valDate = m.prop(null);

// ================================================================================================ [ TOP LEVEL ]
var Shares = {
	controller: function(args) {
		return args;
	},

	view: function(ctrl) {
		return m('div', {id: 'shares-wrapper'}, [
			m.component(ButtonBar, {
				date: valDate,
				buttons: ['Preferred', 'Common', 'Warrants', 'Options', 'Others'],
				onClickHandler: function(e) {
					e.preventDefault();
					var meta = {
						kind: m.prop(e.target.name),
						series: m.prop("__default__"),
						count: m.prop(null),
						conv: m.prop(null),
						price: m.prop(null),
						cap: m.prop(null),
						date: m.prop(""),
						divrate: m.prop(null),
					};
					if (e.target.name === 'preferred') meta['rank'] = m.prop(1);
					FormMap[e.target.name].push(meta);
				}
			}),			
			m.component(Accordion, { data: FormMap, formLookup: formLookup }),
			m.component(NextButton, { 
				forms: FormMap, 
				group: ctrl.group, 
				valdate: valDate
			}),
			m.component(StockForm, { data: FormMap, formLookup: formLookup }),	
		])
	}
}

module.exports = Shares;

// ================================================================================================ [ NEXT BTN ]
var NextButton = {
	controller: function(args) {
		return args;
	},
	view: function(ctrl) {
		function deltaDays(startstr, endstr, delimiter) {
			var startstr = startstr.split(delimiter), endstr = endstr.split(delimiter);			
			var start = new Date(parseInt(startstr[2]), parseInt(startstr[0]) - 1, parseInt(startstr[1]));
			var end = new Date(parseInt(endstr[2]), parseInt(endstr[0]) - 1, parseInt(endstr[1]));
			return Math.floor((start - end) / (1000 * 60 * 60 * 24));
		}

		function updateData(form, dataset, valdate) {
			var fd_sum = 0; 
			var data = dataset.data; 
			var sequence = dataset.sequence; 
			var lookup = dataset.lookup;
			var ranks = dataset.ranks;
			var breakpts = dataset.breakpts;
			// var claimsLookup = dataset.claimsLookup;

			_.keys(form).map(function(key) {
				form[key].map(function(meta) {
					// data['preferred'] resets to empty on update (rebuild the Object);
					// data[key] = {};

					// start set defaults
					var count = meta.count() || 0,
						conversion = meta.conv() || 1,
						price = meta.price() || 0,
						cap = meta.cap() || 0;
						
					var fd_count = parseFloat(count) * parseFloat(conversion);
					// cap === 0 means "false" for participation in breakpt calc; anything else is "true"
					var seq_price = cap === 0 ? parseFloat(price) : parseFloat(price) * parseFloat(cap);
					var liq_pref = parseFloat(price) * parseFloat(count);
					// start dividend calc
					var dividend = 0;
					if (meta.divrate()) {
						// console.log('there is a div rate for: ' + meta.kind() + " " + meta.series());
						var _rate = (parseFloat(meta.divrate()) / 100) * parseFloat(meta.price());
						var _inter = deltaDays(valdate(), meta.date(), "/");
						dividend = _rate * _inter * parseFloat(meta.count());
					}
					// end dividend calc
					var tot_pref = liq_pref + dividend;					
					data[key][meta.series()] = {
						count: fd_count,
						price: seq_price,
						pref: tot_pref,
						claims: {} // init Claims object for Bkpts;
					}

					fd_sum += fd_count;
					
					// Create ordered lookup map:
					if (sequence.indexOf(seq_price) === -1) sequence.push(seq_price);
					if(!lookup[price]) lookup[price] = [];
					lookup[price].push([meta.kind(), meta.series()]);

					// set Rank Preference and push to Breakpts
					if (meta.kind() === 'preferred') {
						if (!ranks[meta.rank()]) {
							// if rank did not previously exist, create one
							ranks[meta.rank()] = 0;
						}
						// increment total preference 
						ranks[meta.rank()] += tot_pref;
					}
				})
			})
			// add total fd shares for easy access
			data['fd'] = fd_sum;			
			// sort the sequence!!
			sequence.sort();			
			// add liquidation preferences as initial breakpts
			_.keys(ranks).map(function(key) {
				var breakpt = ranks[key];
				if (ranks[key - 1]) {
					// -2 because of zero indexing
					breakpt = ranks[key] + breakpts[key - 2];
				}
				breakpts.push(breakpt);
			})
			dataset.prefAll(breakpts[breakpts.length -1]);
		}

		return m('button', {
			className: 'next-btn',
			onclick: function(e){
				e.preventDefault();				
				
				updateData(ctrl.forms, ctrl.group, ctrl.valdate);
				
				var sharesComponent = document.getElementById('shares-wrapper'),
					breakptComponent = document.getElementById('breakpts-wrapper');
				Velocity(sharesComponent, 'fadeOut', {
					complete: function() {
						Velocity(breakptComponent, 'fadeIn')
					}
				});
				// console.log(JSON.stringify(ctrl.group.data, null, 2));
				// console.log(JSON.stringify(ctrl.group.sequence));
				// console.log(JSON.stringify(ctrl.group.lookup, null, 2));
			}
		}, 'Next')
	}
}