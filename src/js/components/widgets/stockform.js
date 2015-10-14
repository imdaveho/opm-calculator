var m = require('mithril');
var _ = require('lodash');

function labelFmt(key) {
	return {
		'series': 'Class Name: ',
		'price': 'Price/Strike: ',
		'conv': 'Conversion (x): ',
		'cap': 'Participation Cap: ',
		'date': 'Issue Date: ',
		'divrate': 'Dividend (%): ',
		'rank': 'Seniority: '
	}[key] || _.capitalize(key) + ": ";
}

function getPlaceholder(key) {
	return {
		'series': 'eg. "Series A" or "A-1"',
		'conv': 'ie. 0.5',
		'cap': 'ie. 2',
		'date': 'mm/dd/yyyy',
		'divrate': 'ie. 8',
		'rank': 'ie. 1'
	}[key] || " "
}


// ================================================================================================ [ TOP LEVEL ]
var StockForm = {
	controller: function(args) {
		return {
			data: args.data, // FormMap
			formLookup: args.formLookup, // meta {...}
		}
	},
	view: function(ctrl) {	
		if (ctrl.formLookup()) {
			var lookup = ctrl.formLookup();
			var form = ctrl.data[lookup.kind][lookup.idx];
			var inputs = [];
			_.keys(form).map(function(key) {
				if(key != 'kind') {
					inputs.push(
						m.component(InputField, {
							data: ctrl.data,
							//prop: form[key], <-- for some reason, this is a deep copy and doesn't link back to ctrl.data...
							name: m.prop(key),
							lookup: ctrl.formLookup
						})
					)
				}	
			})
			return m('div', {className: 'stock-form'}, inputs)

		} return m('div', {className: 'stock-form'}, "")
	}
};

module.exports = StockForm;

// ================================================================================================ [ INPUT FIELD ]
var InputField = {
	controller: function(args) {
		return {
			data: args.data,
			//prop: args.prop, // m.prop(...) <-- for some reason, this is a deep copy and doesn't link back to ctrl.data...
			name: args.name, // m.prop( <key> )
			lookup: args.lookup
		}
	},
	view: function(ctrl) {
		var kind = ctrl.lookup().kind, idx = ctrl.lookup().idx, name = ctrl.name();
		return m('div', {
			className: 'input-group',
			oninput: function(e) {
				ctrl.data[kind][idx][name](e.target.value);
			}
		}, [
			m('div', {className: 'input-label'}, labelFmt(ctrl.name())),
			m('input', {
				value: ctrl.data[kind][idx][name](),
				placeholder: getPlaceholder(name),
				name: name.toLowerCase(),
				className: 'input-box',
				'data-kind': kind,
				'data-idx': idx,
				type: 'text' // keep it simple...
			})
		])
	}
};

// , _.map(form, function(v, k) {
// 	if (k != 'kind') {
// 		return m.component(InputField, {					
// 			data: ctrl.data,
// 			prop: form[k],
// 			name: m.prop(k),
// 			lookup: ctrl.formLookup
// 		})
// 	}
//   })