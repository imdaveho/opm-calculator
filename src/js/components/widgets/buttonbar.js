var m = require('mithril');

var ButtonBar = {
	controller: function(args) {
		return args
	},

	view: function(ctrl) {
		var group = ctrl.buttons.map(function(btn) {
			return m('button', {
				name: btn.toLowerCase(),
				onclick: ctrl.onClickHandler
			}, btn)
		})
		group.push(m.component(ValuationDate, {date: ctrl.date}));
		return m('div', {className: 'button-bar'}, group)
	}
}

module.exports = ButtonBar;

// ================================================================================================ [ VAL DATE ]
var ValuationDate = {
	controller: function(date) {
		return date
	},
	view: function(ctrl) {
		return m('div', {
			className: 'val-date',
			oninput: function(e) {
				// var datedata = e.target.value.split("/");
				// var year = parseInt(datedata[2]), month = parseInt(month = datedata[0]) - 1, day = parseInt(datedata[1]);
				// var fmtdate = new Date(year, month, day);
				// ctrl.date(fmtdate);
				ctrl.date(e.target.value);
			}}, [
			m('div', {className: 'val-date-label'}, "Valuation Date: "),
			m('input', {
				// value: ctrl.date(),
				placeholder: "mm/dd/yyyy",
				name: 'val-date',
				className: 'input-box',
				type: 'text' // keep it simple...
			})
		])
	}
};