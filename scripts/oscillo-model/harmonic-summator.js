extend(HarmonicSummator.prototype,StateComponent.prototype);
/**
 * A HarmonicSummator. Performs Fourier Sums. Questionably superfluous as a constructed object; decidedly OO.
 * @param {PartialSetController} seriesController 
 */
function HarmonicSummator(seriesController){
    StateComponent.call(this);
    if(seriesController){
        this.seriesController = seriesController;
        this.observe(this.seriesController);
    }
    this.values = [];
    this.seriesFrequencyFactor = 3;
}

/**
 * Update method called by Subjects this HarmonicSummator is observing. Filters and handles the update calls based on passed object references and arguments.
 * @override
 * @param {Object} obj - Notifying object
 * @param {any} arg - Special messages!!!
 */
HarmonicSummator.prototype.update = function(obj,arg){
    if(this.seriesController){
        if(obj == this.seriesController){
            this.values = this.seriesController.getPartialValues();
            this.seriesFrequencyFactor = this.seriesController.getSeriesFactor();
            this.notify();
        }
    }
}

/**
 * Returns a value for a given parameter, t, and the harmonic function defined by this HarmonicSummator.
 * @param {number} t - Parameter
 * @param {*} phase - Type of summation (sine or cosine).
 */
HarmonicSummator.prototype.getValueAtParameter = function(t,phase){
    switch(phase){
        case "sine" : 
            return this.getValueAtParameterSin(t);
        break;

        case "cos" :
            return this.getValueAtParameterCos(t);
        break;
    }
}

/**
 * Helper
 * @param {*} t 
 */
HarmonicSummator.prototype.getValueAtParameterSin = function(t){
    let val = 0;
    for(let i = 0; i < this.values.length; i++){
        // wave amplitude
        let amp = this.values[i];
        // wave frequency
         let freq = (i*this.seriesFrequencyFactor)+(this.seriesFrequencyFactor-1);    
        val+= amp*Math.sin(freq*t);
    }
    return val;
}

/**
 * Helper
 * @param {*} t 
 */
HarmonicSummator.prototype.getValueAtParameterCos = function(t){
    let val = 0;
    for(let i = 0; i < this.values.length; i++){
        // wave amplitude
        let amp = this.values[i];
        // wave frequency
         let freq = (i*this.seriesFrequencyFactor)+(this.seriesFrequencyFactor-1); 
        val+= amp*Math.cos(freq*t);
    }
    return val;
}

/**
 * Returns the amplitude sum of all partials in this HarmonicSummator.
 */
HarmonicSummator.prototype.getPartialSum = function(){
    let sum = 0;
    for(let i = 0; i < this.values.length; i++){
        let amp = parseFloat(this.values[i]);
        sum+= amp;
    }
    return sum;   
}