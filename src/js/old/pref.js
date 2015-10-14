var m = require('mithril');

var OPM = {
	controller: function(args) {
		return {
			data: args.data,
			sequence: args.sequence,
			order: args.order,
			active: args.active
		}
	},
	view: function(ctrl) {		
		return m('div', {className: 'opm-wrapper'}, [
			// m.component(CapSummary, {data: ctrl.data, active: ctrl.active}),
			m.component(Calculations, {
				data: ctrl.data,
				sequence: ctrl.sequence,
				order: ctrl.order,
				active: ctrl.active
			})
		])
	}
}

module.exports = OPM;

// var breakPtMap = {};
// function calcBreakpoints(seq, ordered) {
// 	seq.map(function(p) {
// 		console.log(Object.keys(ordered[p]))
// 	})
// }

var Calculations = {
	controller: function(args) {
		return {
			data: args.data,
			sequence: args.sequence,
			order: args.order,
			active: args.active
		}
	},
	view: function(ctrl) {	
		return m('div', {className: 'calculations'}, [
			m('pre', JSON.stringify(ctrl.data, null, 2)),
			m('pre', JSON.stringify(ctrl.sequence)),
			m('pre', JSON.stringify(ctrl.order)),
			m('hr'),
			// m('div', JSON.stringify(breakPtMap)),
			// m('button', {
			// 	onclick: function() {
			// 		calcBreakpoints(ctrl.sequence, ctrl.data, ctrl.order);
			// 	}
			// }, 'Calculate')
		])
	}
};
// function updateData(ctrl) {
// 	var series = ctrl.series,
// 		data = ctrl.data,
// 		rank = ctrl.rank(),
// 		cap = ctrl.cap(),
// 		dividends = ctrl.dividends();
// 	data['preferred'][series]['rank'] = rank;
// 	data['preferred'][series]['dividends'] = dividends;
// 	data['preferred'][series]['cap'] = cap;
// }
// var AddPrefDetails = {
// 	controller: function(args) {
// 		return {
// 			series: args.series,
// 			data: args.data,
// 			rank: m.prop(1),
// 			cap: m.prop(0),
// 			dividends: m.prop(0)
// 		}
// 	},
// 	view: function(ctrl) {
// 		return m('div', {
// 			oninput: function(e) {
// 				ctrl[e.target.name](e.target.value);
// 				updateData(ctrl);
// 			}
// 		}, [
// 			m('label', 'Seniority: '),
// 			m('input', {
// 				name: 'rank',
// 				value: ctrl.rank()
// 			}),
// 			m('label', 'Part. Cap: '),
// 			m('input', {
// 				name: 'cap',
// 				value: ctrl.cap()
// 			}),
// 			m('label', 'Dividends: '),
// 			m('input', {
// 				className: 'dividend',
// 				name: 'dividends',
// 				placeholder: '($) Accum. Dividends',
// 				value: ctrl.dividends()
// 			})
// 		])
// 	}
// }
// var CapSummary = {
// 	controller: function(args) {
// 		return {
// 			data: args.data,
// 			active: args.active
// 		}
// 	},
// 	view: function(ctrl) {
// 		var preferred = ctrl.data['preferred'], 
// 			common = ctrl.data['common'], 
// 			opts = ctrl.data['options'], 
// 			warrants = ctrl.data['warrants']
// 			others = ctrl.data['others'];
// 		return m('div', {className: 'claimsCalc'}, [
// 			m('div', Object.keys(preferred).map(function(key) {
// 				var series = key ? m('li', key) : null;
// 				return m('div', {className: ''}, [
// 					m('span', "Preferred"),
// 					m('ul', [
// 						series,
// 						m('li', 'Preference: ' + preferred[key].pref),
// 						m('li', 'Price: ' + preferred[key].price),
// 						m('li', 'FD Count: ' + preferred[key].count)
// 					]),
// 					m.component(AddPrefDetails, {series: key, data: ctrl.data})
// 				])
// 			})),
// 			m('div', Object.keys(common).map(function(key) {
// 				var series = key ? m('li', key) : null;
// 				return m('div', {className: ''}, [
// 					m('span', "Common"),
// 					m('ul', [
// 						series,
// 						m('li', 'Preference: ' + common[key].pref),
// 						m('li', 'Price: ' + common[key].price),
// 						m('li', 'FD Count: ' + common[key].count)
// 					])
// 				])
// 			})),
// 			m('div', Object.keys(opts).map(function(key) {
// 				var series = key ? m('li', key) : null;
// 				return m('div', {className: ''}, [
// 					m('span', "Options"),
// 					m('ul', [
// 						series,
// 						m('li', 'Proceeds: ' + opts[key].pref),
// 						m('li', 'Price: ' + opts[key].price),
// 						m('li', 'FD Count: ' + opts[key].count)
// 					])
// 				])
// 			})),
// 			m('div', Object.keys(warrants).map(function(key) {
// 				var series = key ? m('li', key) : null;
// 				return m('div', {className: ''}, [
// 					m('span', "Warrants"),
// 					m('ul', [
// 						series,
// 						m('li', 'Proceeds: ' + warrants[key].pref),
// 						m('li', 'Price: ' + warrants[key].price),
// 						m('li', 'FD Count: ' + warrants[key].count)
// 					])
// 				])
// 			})),
// 			m('div', Object.keys(others).map(function(key) {
// 				var series = key ? m('li', key) : null;
// 				return m('div', {className: ''}, [
// 					m('span', "Others"),
// 					m('ul', [
// 						series,
// 						m('li', 'Proceeds: ' + others[key].pref),
// 						m('li', 'Price: ' + others[key].price),
// 						m('li', 'FD Count: ' + others[key].count)
// 					])
// 				])
// 			})),
// 		])
// 	}
// }