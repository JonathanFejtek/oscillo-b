extend(PartialSetController.prototype,StateComponent.prototype);
/**
 * 
 * @param {*} parentElement 
 * @param {*} numPartials 
 */
function PartialSetController(parentElement,numPartials) {
    StateComponent.call(this);
    this.parentElement = parentElement;
    this.container = document.createElement("div");
    this.sliderGroup = new SliderFloatController(this.container,64);
    this.observe(this.sliderGroup);

    this.factorSlider = new ParameterRangeInput(this.container, "Frequency Series Factor");
    this.factorSlider.setRange(2,25);
    this.factorSlider.setNumericType("int");


    this.observe(this.factorSlider);
    
    this.parentElement.appendChild(this.container);
}

/**
 * 
 * @param {*} obj 
 * @param {*} arg 
 */
PartialSetController.prototype.update = function(obj,arg){

    if(obj == this.factorSlider){
        var factorChange = {type : "partial-set-factor-change"};
        this.notify(factorChange);
    }
    else{
        this.notify(arg);
    }
   
}

/**
 * 
 */
PartialSetController.prototype.getPartialValues = function(){
    return this.sliderGroup.getValues();
}

/**
 * 
 * @param {*} values 
 */
PartialSetController.prototype.setPartialValues = function(values,notify = true){
    this.sliderGroup.setValues(values);
    if(notify){
        this.notify();        
    }
}

/**
 * 
 * @param {*} index 
 * @param {*} value 
 */
PartialSetController.prototype.setPartialValue = function(index,value){
    this.sliderGroup.setValue(index,value);
    this.notify();
}

/**
 * 
 */
PartialSetController.prototype.getSeriesFactor = function(){
    return this.factorSlider.getValue();
}

/**
 * 
 * @param {*} v 
 */
PartialSetController.prototype.setSeriesFactor = function(v,notify=true){
    this.factorSlider.setValue(v);
    if(notify){
        this.notify();
    }
}




extend(PartialViewController.prototype,StateComponent.prototype);
/**
 * 
 * @param {*} parentElement 
 * @param {*} numPartials 
 */
function PartialViewController(parentElement,numPartials){
    StateComponent.call(this);
    this.parentElement = parentElement;
    this.container = document.createElement("div");

    this.containerHeader = document.createElement("div");
    this.containerHeader.setAttribute("class","partial-vcontroller-header");

    this.headerLabel = document.createElement("h3");
    this.headerLabel.setAttribute("class","partial-vcontroller-header-label");
    this.headerLabel.innerHTML = "Partial Controls";

    this.containerHeader.appendChild(this.headerLabel);

    this.partialOptions = document.createElement("div");
    this.partialOptions.setAttribute("class","partial-vcontroller-p-options");

    this.containerHeader.appendChild(this.partialOptions);

    this.linkPartialsToggle = new ToggleButton(this.partialOptions,"16px","16px","Link Partials");
    this.linkFactorsToggle = new ToggleButton(this.partialOptions,"16px","16px","Link Factors");

    this.container.appendChild(this.containerHeader);

    this.sinePartialController = new PartialSetController(this.container,numPartials);
    this.cosPartialController = new PartialSetController(this.container,numPartials);

    this.observe(this.sinePartialController);
    this.observe(this.cosPartialController);
    this.observe(this.linkPartialsToggle);
    this.observe(this.linkFactorsToggle);

    this.parentElement.appendChild(this.container);

}

/**
 * 
 * @param {*} obj 
 * @param {*} arg 
 */
PartialViewController.prototype.update = function(obj,arg){  
    // filter obj source

    if(obj instanceof PresetManager){
        if(arg){
            this.cosPartialController.setSeriesFactor(arg["cosFactor"],false);
            this.sinePartialController.setSeriesFactor(arg["sineFactor"],false);
            this.cosPartialController.setPartialValues(arg["cosPartials"]);
            this.sinePartialController.setPartialValues(arg["sinePartials"]);
            this.notify();
        }
    }

    switch(obj){
        // if object is linkedPartialsToggle
        case this.linkPartialsToggle :
        break;

        case this.linkFactorsToggle :
        break;

        // if object is sinePartialController
        case this.sinePartialController :
            // if partials are set to linked
            if(this.linkPartialsToggle.toggled){
                // if sineController notifies a partial-value change
                if(arg && arg["type"] == "slider-group-value-change"){
                    // set corresponding value of sibling
                    this.cosPartialController.setPartialValue(arg["index"],arg["value"]);
                }
            }
            // if factors are set to linked
            if(this.linkFactorsToggle.toggled){
                // if cosController notifies a factor-value change
                if(arg && arg["type"] == "partial-set-factor-change"){
                    // set corresponding factor value of sibling
                    this.cosPartialController.setSeriesFactor(this.sinePartialController.getSeriesFactor());
                }
            }
            // notify observers
            this.notify();
        break;
        
        // if object is cosController
        case this.cosPartialController :
            // if partials are set to linked
            if(this.linkPartialsToggle.toggled){
                // if cosController notifies a partial-value change
                if(arg && arg["type"] == "slider-group-value-change"){
                    // set corresponding partial value of sibling
                    this.sinePartialController.setPartialValue(arg["index"],arg["value"]);
                }
            }

            // if factors are set to linked
            if(this.linkFactorsToggle.toggled){
                // if cosController notifies a factor-value change
                if(arg && arg["type"] == "partial-set-factor-change"){
                    // set corresponding factor value of sibling controller
                    this.sinePartialController.setSeriesFactor(this.cosPartialController.getSeriesFactor());
                }
            }
            // notify observers
            this.notify();
        break;
    }
}

/**
 * 
 */
PartialViewController.prototype.getSineController = function(){
    return this.sinePartialController;
}

/**
 * 
 */
PartialViewController.prototype.getCosController = function(){
    return this.cosPartialController;
}

