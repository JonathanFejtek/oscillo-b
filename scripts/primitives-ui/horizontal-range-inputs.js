// This script file contains declarations for three constructor functions:
// 1. HorizontalSlider - A primitive component wrapper for a horizontal range input.
// 2. ParameterRangeInput - A component that is composed of a HorizontalSlider and a text input. Meant for inputing numeric       parameter values
// 3. NumericSetController - A group of ParameterRangeInputs 


extend(HorizontalSlider.prototype,Subject.prototype);
/**
 * A HorizontalSlider. A simple component wrapper for a horizontal slider. Constructs a HorizontalSlider in the specified parent HtmlDivElement. HorizontalSlider extends Subject, and thus can be observed and notify Observers of state changes.
 * 
 * @param {HtmlDivElement} parentElement - The parent HtmlDivElement of the HorizontalSlider.
 * @param {*} sliderClass (currently unimplemented)
 */
function HorizontalSlider(parentElement,sliderClass){
    Subject.call(this);
    this.parentElement = parentElement;

    // create component container
    this.container = document.createElement("div");
    this.container.setAttribute("class","-range-container");

    // create input element of type range.
    this.rangeInput = document.createElement("INPUT");
    this.rangeInput.setAttribute("class","-range-input");
    this.rangeInput.setAttribute("type","range");
    this.rangeInput.setAttribute("step",String(1.0/32));
    this.rangeInput.setAttribute("min","0");
    this.rangeInput.setAttribute("max", "1");
    this.rangeInput.setAttribute("value","0");

    // setup component hierarchy
    this.container.appendChild(this.rangeInput);
    this.parentElement.appendChild(this.container);

    this.rangeInput.addEventListener("input",this.handle.bind(this));
}

/**
 * Returns the current value of this HorizontalSlider.
 */
HorizontalSlider.prototype.getValue = function(){
    return this.rangeInput.value;
}

/**
 * Sets/overrides the current value of this HorizontalSlider.
 * @param {number} v - The value to set for this HorizontalSlider.
 */
HorizontalSlider.prototype.setValue = function(v){
    this.rangeInput.value = v;
}

/**
 * Handles an event input on this HorizontalSlider. Notifies Observers of state change.
 * @param {Event} e - Event to handle.
 */
HorizontalSlider.prototype.handle = function(e){
    this.notify();
}

/**
 * Sets the numeric range for this HorizontalSlider.
 * @param {number} low - The min range value for this HorizontalSlider.
 * @param {number} high - The max range value for this HorizontalSlider.
 */
HorizontalSlider.prototype.setRange = function(low,high){
    this.rangeInput.setAttribute("min",low);
    this.rangeInput.setAttribute("max",high);  
    this.rangeInput.setAttribute("value",low);
}

/**
 * Sets the step size for this HorizontalSlider.
 * @param {number} s - The step size to set for this HorizontalSlider.
 */
HorizontalSlider.prototype.setStepSize = function(s){
    this.rangeInput.setAttribute("step",s);
}

//---------------------------------------------------------------------------------//




extend(ParameterRangeInput.prototype,StateComponent.prototype);
/**
 * A ParemeterRangeInput component. Is composed of a HorizontalSlider and text input element. Is meant to input numeric values either by click-drag (range-input) or text input. Extends StateComponent and can communicate with other StateComponents via observe(), notify() and update().
 * 
 * @param {HtmlDivElement} parentElement - The parent element for this ParameterRangeInput.
 * @param {string} label - The content that will appear on this ParameterRangeInput's label.
 */
function ParameterRangeInput(parentElement,label){
    StateComponent.call(this);
    this.parentElement = parentElement;
    //range for this input
    this.low = 0;
    this.high = 1;
    this.name = label;
    //type of number this input will deal with
    this.numericType = "float";

    // create component container
    this.container = document.createElement("div");
    this.container.setAttribute("class","-pi-container");

    // create component label
    this.label = document.createElement("h5");
    this.label.setAttribute("class","-pi-range-input-label");
    if(label){
        this.label.innerHTML = label;
    }

    // add label element to component container
    this.container.appendChild(this.label);

    // create a horizontal slider component inside this component's container
    this.horizontalSlider = new HorizontalSlider(this.container);
    // observe horizontal slider so this component is notified of state changes
    this.observe(this.horizontalSlider);
    
    // create text input element for this component
    this.textInput = document.createElement("INPUT");
    this.textInput.setAttribute("class","-pi-text-input");
    this.textInput.value = this.horizontalSlider.getValue();

    // setup remaining component hierarchy
    this.container.appendChild(this.textInput);
    this.parentElement.appendChild(this.container);

    this.textInput.addEventListener("change",this.handle.bind(this));
}

/**
 * Handles and filters events from UI elements this component contains.
 * @param {Event} e - Event to handle and filter.
 */
ParameterRangeInput.prototype.handle = function(e){
    // this switch is not necessary in this case, but I sometimes use it for the sake of consistency among event handling methods...
    switch(e.target){
        case this.textInput :
            // truncate if the user inputs text outside of allowed range
            if(this.textInput.value < this.low){
                this.textInput.value = this.low;
            }

            else if(this.textInput.value > this.high){
                this.textInput.value = this.high;
            }

            if(this.numericType == "int"){
                this.textInput.value = Math.round(this.textInput.value);
            }
            // update the slider of input!
            this.horizontalSlider.setValue(this.textInput.value);
            this.notify();
        break;
    }
}

/**
 * Update method called by any Subjects this StateComponent might observe.
 * @override
 * @param {StateComponent/Subject} obj - Notifying Subject.
 */
ParameterRangeInput.prototype.update = function(obj){
    if(obj === this.horizontalSlider){
        this.textInput.value = this.horizontalSlider.getValue();
    }
    this.notify();
}

/**
 * Sets the numeric type for this ParameterRangeInput.
 * @param {string} type - Type of numeric value ('float' or 'int').
 */
ParameterRangeInput.prototype.setNumericType = function(type){
    this.numericType = type;
    if(type == "int"){
        this.horizontalSlider.setStepSize(1);
    }
}

/**
 * Sets the numeric range for this ParameterRangeInput.
 * @param {number} low - Min input value.
 * @param {number} high - Max input value.
 */
ParameterRangeInput.prototype.setRange = function(low,high){
    this.low = low;
    this.high = high;
    this.horizontalSlider.setRange(low,high);
    this.textInput.value = low;
}

/**
 * Returns the current value of this ParameterRangeInput.
 */
ParameterRangeInput.prototype.getValue = function(){
    return this.horizontalSlider.getValue();
}

/**
 * Sets the value of this ParameterRangeInput
 * @param {number} v - the value to set for this ParameterRangeInput
 */
ParameterRangeInput.prototype.setValue = function(v){
    this.horizontalSlider.setValue(v);
    this.textInput.value = v;
}


//--------------------------------------------------------------------------------//



extend(NumericSetController.prototype,StateComponent.prototype);
/**
 * A NumericSetController. Comprises a group of ParameterRangeInputs. Extends StateComponent.
 * @param {HtmlDivElement} parentElement - The parent element of this NumericSetController.
 */
function NumericSetController(parentElement){
    StateComponent.call(this);
    this.parentElement = parentElement;

    // child components
    this.parameterRangeInputs = {};

    // the container for this component
    this.container = document.createElement("div");
    this.container.setAttribute("class","numeric-set-controller-container");

    // setup hierarchy
    this.parentElement.appendChild(this.container);
}

/**
 * Adds a ParameterRangeInput controller to this component.
 * @param {*} name - The name of the controller. The name will serve as both key and label.
 * @param {*} low - The numeric low bound of the new controller.
 * @param {*} high - The numeric high bound of the new controller.
 */
NumericSetController.prototype.addController = function(name,low,high){
    if(!this.parameterRangeInputs.hasOwnProperty(name)){
        var newController = new ParameterRangeInput(this.container,name);
        if(typeof low == 'number' && typeof high == 'number'){
            newController.setRange(low,high);
        }
        this.parameterRangeInputs[name] = newController;
        this.observe(newController);

        return this.parameterRangeInputs[name];
    }
}

/**
 * Update method called by any Subjects this StateComponent might be observing.
 * @override
 * @param {*} obj 
 */
NumericSetController.prototype.update = function(obj){
    this.notify(obj.name);
}

/**
 * Returns a specified controller contained in this NumericSetController.
 * @param {string} name - Name of desired controller.
 */
NumericSetController.prototype.getController = function(name){
    return this.parameterRangeInputs[name];
}

/**
 * Gets the value for a specified controller contained in this NumericSetController.
 * @param {string} controllerName - Name of controller for which to get value.
 */
NumericSetController.prototype.getValue = function(controllerName){
    return this.parameterRangeInputs[controllerName].getValue();
}

/**
 * Sets a value for a specified controller contained in this NumericSetController.
 * @param {*} controllerName - Name of the controller for which to set value.
 * @param {*} val - Value to set.
 */
NumericSetController.prototype.setValue = function(controllerName, val){
    this.parameterRangeInputs[controllerName].setValue(val);
}