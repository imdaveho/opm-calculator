var m = require('mithril');
var _ = require('lodash');

var Formulas = require('./formulas');

var opm_fields = {
	vola: m.prop(null),
	intr: m.prop(null),
	term: m.prop(null),
	spot: m.prop(null)
}

function labelFmt(key) {
	return {
		'vola': 'Volatility (%): ',
		'intr': 'Interest (%): ',
		'term': 'Exit Term: ',
		'spot': 'Equity Value: '
	}[key];
}

function getPlaceholder(key) {
	return {
		'vola': 'ie. 125',
		'intr': 'ie. 0.97',
		'term': 'ie. 5',
		'spot': 'ie. 1000000'
	}[key] || " "
}

var CollarMap = m.prop({});


// ================================================================================================ [ TOP LEVEL ]
var Calculations = {
	controller: function(args) {
		return args;
	},
	view: function(ctrl) {
		return m('div', {id: 'breakpts-wrapper'}, [
			m.component(OPMFields, {fields: opm_fields}),
			m.component(BkBtnGroup, {fields: opm_fields, group: ctrl.group}),
			m('hr'),
			m.component(OPMResults, {data: ctrl.group.data, collar: CollarMap}),
			// m('span', 'Data: '),
			// m('pre', JSON.stringify(ctrl.group.data, null, 2)),
			// m('span', 'Sequence: '),
			// m('pre', JSON.stringify(ctrl.group.sequence)),
			// m('span', 'Lookup: '),
			// m('pre', JSON.stringify(ctrl.group.lookup)),
			// m('span', 'Ranks: '),
			// m('pre', JSON.stringify(ctrl.group.ranks)),
			m('span', 'Breakpoints: '),
			m('pre', JSON.stringify(ctrl.group.breakpts)),
			// m('span', 'Preference: '),
			// m('div', ctrl.group.prefAll())
			// m('span', 'OPM: '),
			// m('pre', JSON.stringify(CollarMap(), null, 2)),
		])
	}
};

module.exports = Calculations;

// ================================================================================================ [ OPM PARAMS ]
var OPMFields = {
	controller: function(args) {
		return args
	},
	view: function(ctrl) {
		return m('div', {className: 'opm-form-wrapper'}, 
			_.keys(ctrl.fields).map(function(key) {
				return m.component(InputField, {
					val: ctrl.fields[key],
					key: key,
				})
			})
		)
	}
};

// ================================================================================================ [ OPM RESULTS ]
var OPMResults = {
	controller: function(args) {
		return args
	},
	view: function(ctrl) {
		return m('div', {className: 'opm-result-wrapper'}, [
			m('div', "Preferred: ", _.map(ctrl.data['preferred'], function(series, key) {
				if (_.keys(ctrl.collar()).length > 0) {
					var aggregate = 0;
					_.map(series.claims, function(claim, bkpt) {
						// console.log(claim);
						aggregate += (ctrl.collar()[bkpt].collar.call * claim);
					});
					return ('div', key + ' Value: ' + (aggregate/1000000).toFixed(3) + ' | Per Share: ' + (aggregate/(series.count)).toFixed(4));
				}
			})),
			m('div', "Common: ", _.map(ctrl.data['common'], function(series, key) {
				if (_.keys(ctrl.collar()).length > 0) {
					var aggregate = 0;
					_.map(series.claims, function(claim, bkpt) {
						// console.log(claim);
						aggregate += (ctrl.collar()[bkpt].collar.call * claim);
					});
					return ('div', key + ' Value: ' + (aggregate/1000000).toFixed(3) + ' | Per Share: ' + (aggregate/(series.count)).toFixed(4));
				}
			})),
			m('div', "Options: ", _.map(ctrl.data['options'], function(series, key) {
				if (_.keys(ctrl.collar()).length > 0) {
					var aggregate = 0;
					_.map(series.claims, function(claim, bkpt) {
						// console.log(claim);
						aggregate += (ctrl.collar()[bkpt].collar.call * claim);
					});
					return ('div', key + ' Value: ' + (aggregate/1000000).toFixed(3) + ' | Per Share: ' + (aggregate/(series.count)).toFixed(4));
				}
			})),
			m('div', "Warrants: ", _.map(ctrl.data['warrants'], function(series, key) {
				if (_.keys(ctrl.collar()).length > 0) {
					var aggregate = 0;
					_.map(series.claims, function(claim, bkpt) {
						// console.log(claim);
						aggregate += (ctrl.collar()[bkpt].collar.call * claim);
					});
					return ('div', key + ' Value: ' + (aggregate/1000000).toFixed(3) + ' | Per Share: ' + (aggregate/(series.count)).toFixed(4));
				}
			})),
			m('div', "Other: ", _.map(ctrl.data['others'], function(series, key) {
				if (_.keys(ctrl.collar()).length > 0) {
					var aggregate = 0;
					_.map(series.claims, function(claim, bkpt) {
						// console.log(claim);
						aggregate += (ctrl.collar()[bkpt].collar.call * claim);
					});
					return ('div', key + ' Value: ' + (aggregate/1000000).toFixed(3) + ' | Per Share: ' + (aggregate/(series.count)).toFixed(4));
				}
			}))
		])
	}
};

// ================================================================================================ [ INPUT FIELD ]
// TODO: Refactor InputFields (this is a copy)
var InputField = {
	controller: function(args) {
		return args
	},
	view: function(ctrl) {
		return m('div', {
			className: 'input-group',
			oninput: function(e) {
				ctrl.val(e.target.value)
			}
		}, [
			m('div', {className: 'input-label'}, labelFmt(ctrl.key)),
			m('input', {
				value: ctrl.val(),
				placeholder: getPlaceholder(ctrl.key),
				name: ctrl.key.toLowerCase(),
				className: 'input-box',
				type: 'text' // keep it simple...
			})
		])
	}
};
// ================================================================================================ [ CALCULATE BTN ]
var BkBtnGroup = {
	controller: function(args) {
		return args;
	},
	view: function(ctrl) {
		return m('div', {className: 'bkbtn-group'}, [
			m.component(CalculateBtn, ctrl),
			m.component(GoBackBtn, ctrl)
		])
	}
};

var CalculateBtn = {
	controller: function(args) {
		return args;
	},
	view: function(ctrl) {
		return m('button', {
			className: 'calc-btn',
			onclick: function(e) {
				e.preventDefault();

				Formulas.setBreaks(ctrl.group, function() {
					if(opm_fields.vola() && opm_fields.intr() && opm_fields.term() && opm_fields.spot()) {
						CollarMap(Formulas.doOPM(ctrl.group.data, ctrl.group.breakpts, opm_fields));
					} else {
						// TODO: alert or some form validation...
					}					
				});
			}
		}, "Calculate")
	}
};

var GoBackBtn = {
	controller: function(args) {
		return args
	},
	view: function(ctrl) {
		return m('button', {
			id: 'go_back_btn',
			onclick: function(e) {
				e.preventDefault();

				// reset all local datastore
				ctrl.group.data = {
					'preferred': {},
					'common': {},
					'options': {},
					'warrants': {},
					'others': {},
					'fd': 0
				};
				ctrl.group.sequence = [];
				ctrl.group.lookup = {};
				ctrl.group.breakpts = [];
				ctrl.group.ranks = {};
				ctrl.group.claimsLookup = {};

				var sharesComponent = document.getElementById('shares-wrapper'),
					breakptComponent = document.getElementById('breakpts-wrapper');
				Velocity(breakptComponent, 'fadeOut', {
					complete: function() {
						Velocity(sharesComponent, 'fadeIn')
					}
				});
			}
		}, "Back")
	}
}