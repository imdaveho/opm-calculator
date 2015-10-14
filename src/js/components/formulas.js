var Formulas = {
    // ================================================================================================ [ OPM ]
    setBlackScholes: function(underlying, strike, volatility, interest, dividend, time) {
        const a1 = 0.436184;
        const a2 = -0.120168;
        const a3 = 0.937298;
        
        var _interest = Math.log(1 + interest);
        var _price = underlying * Math.exp(-dividend * time);
        
        var d1 = (Math.log(underlying / strike) +
                 (_interest - dividend + 0.5*Math.pow(volatility, 2)) * time) /
            	 (volatility * Math.pow(time, 0.5));
        var d2 = d1 - volatility * Math.pow(time, 0.5);
        
        var nPrimeD1 = Math.exp(-(0.5 * Math.pow(d1, 2))) / Math.pow((2 * 3.141592654), 0.5);
        var k1 = 1 / (1 + 0.33267 * Math.abs(d1));
        var nD1temp = 1 - nPrimeD1 * (a1 * k1 + a2 * Math.pow(k1, 2) + a3 * Math.pow(k1, 3));
        
        var nPrimeD2 = Math.exp(-(0.5 * Math.pow(d2, 2))) / Math.pow((2 * 3.141592654), 0.5);
        var k2 = 1 / (1 + 0.33267 * Math.abs(d2));
        var nD2temp = 1 - nPrimeD2 * (a1 * k2 + a2 * Math.pow(k2, 2) + a3 * Math.pow(k2, 3));
        
        var nD1 = d1 > 0 ? nD1temp : (1 - nD1temp);
        var nD2 = d2 > 0 ? nD2temp : (1 - nD2temp);
        
       	return optionValue(_price, nD1, _interest, nD2, strike, time);
    },

    optionValue: function(price, nD1, interest, nD2, strike, time) {
        var call = (price * nD1) - (strike * Math.exp(-interest * time) * nD2);
        var put = strike * Math.exp(-interest * time) * (1 - nD2) - price * (1 - nD1);
        
        return {
            call: call,
            put: put
        };
    },
    // ================================================================================================ [ BREAKPTS ]
    calcBreaks: function(price, shares, proceed, preference) {
        return price * shares - proceed + preference
    },

    setBreaks: function(dataset) {
        var shares = 0, proceeds = 0;
        var pref_stack = dataset.prefAll();

        dataset.sequence.map(function(price) {
            var coord = dataset.lookup[price];
            // get the total amount of shares @ price range
            coord.map(function(pair) {
                shares += dataset.data[pair[0]][pair[1]].count;
                proceeds += dataset.data[pair[0]][pair[1]].pref;
                if (pair[0] === 'preferred') {
                    pref_stack -= dataset.data[pair[0]][pair[1]].pref;
                    // prevent double substraction of preference due to conversion
                    proceeds -= dataset.data[pair[0]][pair[1]].pref
                }                
            });
            // since pref rank already gets the 0 value, we skip it
            if (price != 0) {
                var bkpt = Formulas.calcBreaks(price, shares, proceeds, pref_stack);
                dataset.breakpts.push(bkpt)
            }
        })
    }
}

module.exports = Formulas;