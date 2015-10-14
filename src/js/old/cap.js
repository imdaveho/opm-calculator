var m = require('mithril');

var FormsList = [];
var SecurityTypeOptions = ['preferred', 'common', 'options', 'warrants', 'others'];

var Capitalization = {
	controller: function(args) {
		return {
			data: args.data,
			sequence: args.sequence,
			order: args.order,
			active: args.active
		}
	},

	view: function(ctrl) {
		return m('div', {className: 'capOuter'} ,[
			m('div', {className: 'buttonGroup'}, [
				m.component(NewFormButton), 
				m.component(NextStepButton, {
					data: ctrl.data,
					sequence: ctrl.sequence,
					order: ctrl.order,
					active: ctrl.active
				})
			]),
			m('div', {className: 'capInner'}, FormsList.map(function(group){
				return m.component(group.form, {context: group.context})
			}))
		])
	}
};

// ================================================================================================================ [Form]

var CapForm = {
	controller: function(args) {
		return {
			fields: args.context
		}
	},

	view: function(ctrl) {
		return m('div', {className: 'formWrapper'}, [
			m.component(formSelect, {
				label: 'Stock Type*: ',
				name: 'kind',
				options: SecurityTypeOptions,
				fields: ctrl.fields
			}),
			m.component(formInput, {
				type: 'text',		
				label: 'Stock Series: ',
				name: 'series',
				placeholder: 'ie. Series A, E-2, BBB',
				fields: ctrl.fields
			}),
			m.component(formInput, {
				type: 'number',			
				name: 'count',	
				label: 'Share Count*: ',
				placeholder: 'ie. 1M Common Shrs',
				fields: ctrl.fields
			}),
			m.component(formInput, {
				type: 'number',			
				name: 'conversion',	
				label: 'Conversion Rate',
				placeholder: 'leave blank: 1x',
				fields: ctrl.fields
			}),
			m.component(formInput, {
				type: 'number',			
				name: 'price',	
				label: 'Price/Strike',
				placeholder: 'leave blank: $0.00',
				fields: ctrl.fields
			}),
		])
	}
};

// ================================================================================================================ [Inputs]

var formInput = {
	controller: function(args) {
		var label = args.label;
		var fields = args.fields; 
		delete args['label'];
		delete args['fields'];
		return {
			args: args,
			label: label,			
			fields: fields
		}
	},
	view: function(ctrl) {
		ctrl.args['value'] = ctrl.fields[ctrl.args['name']]();
		ctrl.args['oninput'] = function() {			
			ctrl.fields[ctrl.args['name']](this.value);	
		}
		return m('div', {className: 'formField input'}, [
			m('label', ctrl.label),
			m('input', ctrl.args)
		])
	}
};

var formSelect = {
	controller: function(args) {
		var label = args.label;
		var options = args.options;
		var fields = args.fields; 
		delete args['label'];
		delete args['options'];
		delete args['fields'];
		return {
			args: args,
			label: label,
			options: options,			
			fields: fields
		}
	},
	view: function(ctrl) {
		ctrl.args['value'] = ctrl.fields['kind']();
		ctrl.args['onchange'] = function() {
			ctrl.fields['kind'](this.value);
		}
		return m('div', {className: 'formField select'}, [
			m('label', ctrl.label),
			m('select', ctrl.args, [
				ctrl.options.map(function(type) {
					return m('option', type)
				})
			])
		])
	}
};

// ================================================================================================================ [Buttons]

var NewFormButton = {
	view: function(){
		return m('button', {
			onclick: function(e){
				e.preventDefault();
				FormsList.push({
					form: CapForm,
					context: {
						kind: m.prop("preferred"),
						series: m.prop(""),
						count: m.prop(),
						conversion: m.prop(),
						price: m.prop()
					}
				});
			}
		}, 'Add Stock')
	}
};

var NextStepButton = {
	controller: function(args) {
		return {
			data: args.data,
			sequence: args.sequence,
			order: args.order,
			active: args.active
		}
	},
	view: function(ctrl){
		function updateData() {
			var sum = 0;
			FormsList.map(function(group) {				
				// Set local variables
				var ctx = group.context;
				var price = parseFloat(ctx.price()) || 0;
				var conv = parseFloat(ctx.conversion()) || 1;
				var count = parseInt(ctx.count()) || 0; 
				
				// Create capitalization map
				var series = ctx.series() ? ctx.series() : '__default__';
				ctrl.data[ctx.kind()][series] = {
					price: price,
					count: count * conv,
					pref: count * price,
					rank: 1,
					cap: 0,
					dividends: 0
				}
				sum += count * conv;
				
				// Create ordered lookup map:
				if (ctrl.sequence.indexOf(price) === -1) ctrl.sequence.push(price);
				if(!ctrl.order[price]) ctrl.order[price] = [];
				ctrl.order[price].push([ctx.kind(), series]);
				// if(!ctrl.order[price][ctx.kind()]) ctrl.order[price][ctx.kind()] = {};				
				// if(!ctrl.order[price][ctx.kind()][series]) ctrl.order[price][ctx.kind()][series] = {};
				// ctrl.order[price][ctx.kind()][series] = ctrl.data[ctx.kind()][series];
			})
			ctrl.data['fd'] = sum;
			ctrl.sequence.sort();
		}
		return m('button', {
			onclick: function(e){
				e.preventDefault();				
				updateData();
				ctrl.active(false);
				console.log(ctrl.data);
				console.log(ctrl.sequence);
				console.log(ctrl.order);
			}
		}, 'Next')
	}
};

module.exports = Capitalization;