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
			m('span', 'Data: '),
			m('pre', JSON.stringify(ctrl.group.data, null, 2)),
			m('span', 'Sequence: '),
			m('pre', JSON.stringify(ctrl.group.sequence)),
			m('span', 'Lookup: '),
			m('pre', JSON.stringify(ctrl.group.lookup)),
			m('span', 'Ranks: '),
			m('pre', JSON.stringify(ctrl.group.ranks)),
			m('span', 'Breakpoints: '),
			m('pre', JSON.stringify(ctrl.group.breakpts)),
			m('span', 'Preference: '),
			m('div', ctrl.group.prefAll())
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

				Formulas.setBreaks(ctrl.group);

				// console.log(JSON.stringify(ctrl.fields, null, 2));
				ctrl.group.breakpts.map(function(pt) {
					console.log(Math.floor(pt))
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