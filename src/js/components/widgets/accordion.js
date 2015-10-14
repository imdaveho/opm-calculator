var m = require('mithril');
var _ = require('lodash');
var Velocity = require('velocity-animate');

function toggleState(elem, bool, reverse) {
	var state = bool();
	var _h = state ? 0 : reverse;
	Velocity(elem, {height: _h}, {
		queue: false,
		begin: function() {
			if(state) elem.style.overflow = 'hidden'
		},
		complete: function() {
			if (!state) {
				elem.style.overflow = '',
				elem.style.height = ''
			}
		}
	});
	bool(!state);
}


// ================================================================================================ [ TOP LEVEL ]
var Accordion = {
	controller: function(args) {
		return args //.data, .activeForm
	},
	view: function(ctrl) {
		return m('div', {className: 'accordion'},
			// O(n) = 5 constant time:
			_.map(_.keys(ctrl.data), function(key) { 
				return m('div', {className: 'accordion-group'}, [
					m.component(Label, {
						key: key, 
						data: ctrl.data
					})
					, m.component(Wrapper, {
						data: ctrl.data,
						key: key,
						formLookup: ctrl.formLookup,
					})
				])
			})
		)
	}
};

module.exports = Accordion;

// ================================================================================================ [ GROUP - LABEL ]
var Label = {
	controller: function(args) {
		return {
			label: args.key,
			data: args.data,
			state: m.prop(true)
		}
	},
	view: function(ctrl) {
		return m('div', {
			className: 'accordion-label',
			onclick: function(e) {
				var target = e.target.parentNode;
				while (!target.classList.contains('accordion-group')) {
					target = target.parentNode;
				}
				var wrapper = target.querySelector('.accordion-wrapper');
				var items = wrapper.querySelectorAll('.accordion-item');		
				if (items && items.length) {					
					var h = parseFloat(getComputedStyle(items[0]).height);
					var len = parseFloat(items.length);
					var reverse = (h * len).toString() + 'px';
					
					toggleState(wrapper, ctrl.state, reverse);
				}
			}
		}, [
			m('span', {className: ""}, _.capitalize(ctrl.label)),
			m('span', {className: "label-count" }, "[ " + ctrl.data[ctrl.label].length + " ]")
		]);
	}

};
// ================================================================================================ [ GROUP - WRAPPER ]
var Wrapper = {
	controller: function(args) {
		return args // .data, .key (kind)
	},
	view: function(ctrl) {
		var idx = 0;
		return m('div', {
			className: 'accordion-wrapper'
		}, _.map(ctrl.data[ctrl.key], function(meta) {
				var item = m.component(Item, {
						data: ctrl.data,
						meta: meta,
						kind: ctrl.key,
						idx: idx,
						formLookup: ctrl.formLookup,
					})
				idx++;
				return item;
			})
		)
	}
};
// ================================================================================================ [ FORM ITEM ]
var Item = {
	controller: function(args) {
		return {
			data: args.data,
			meta: args.meta,
			kind: args.kind,
			idx: args.idx,
			formLookup: args.formLookup,
			state: m.prop(false)
		}
	},

	view: function(ctrl) {
		var del = ctrl.state() ? m('div', {
			className: 'delete-btn',
			onclick: function(e) {
				e.preventDefault();
				ctrl.data[ctrl.kind].splice(ctrl.idx, 1);
			}
		}, 'X') : null;
		
		return m('div', {
			className: 'accordion-item',
			onmouseover: function(e) {
				ctrl.state(true)
			},
			onmouseleave: function(e) {
				ctrl.state(false)
			},
			onclick: function(e) {
				ctrl.formLookup({kind: ctrl.kind, idx: ctrl.idx});
				_.map(document.getElementsByClassName('accordion-item'), function(elem) {
					elem.classList.remove('active-acc-item');
				});

				var target = e.target;
				while (!target.classList.contains('accordion-item')) {
					target = target.parentNode;
				}
				
				target.classList.add('active-acc-item');
			}
		}, [
			m('span', "Series: " + ctrl.meta.series()),
			del
		])// item panel, delete button
	}
}