extend(VerticalSlider.prototype,Subject.prototype);
/**
 * 
 * @param {*} parentElement 
 */
function VerticalSlider(parentElement){
    Subject.call(this);
    this.parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.setAttribute("class","v-slider-container");

    this.parentElement.appendChild(this.container);


    this.rangeInput = document.createElement("INPUT");
    this.rangeInput.setAttribute("class","v-slider");
    this.rangeInput.setAttribute("type","range");
    this.rangeInput.setAttribute("step",String(1.0/32));
    this.rangeInput.setAttribute("min","0");
    this.rangeInput.setAttribute("max", "1");
    this.rangeInput.setAttribute("value","0");

    this.container.appendChild(this.rangeInput);

    this.parentGroup;
    this.componentKey;

    this.rangeInput.addEventListener("input",this.handle.bind(this));
}

/**
 * 
 * @param {*} sliderGroup 
 */
VerticalSlider.prototype.addParentGroup = function(sliderGroup){
    this.parentGroup = sliderGroup;
    this.parentGroup.observe(this);
}

/**
 * 
 * @param {*} e 
 */
VerticalSlider.prototype.handle = function(e){
    this.notify();
}

/**
 * 
 * @param {*} k 
 */
VerticalSlider.prototype.setComponentKey = function(k){
    this.componentKey = k;
}

/**
 * 
 */
VerticalSlider.prototype.getValue = function(){
    return parseFloat(this.rangeInput.value);
}

/**
 * 
 * @param {*} v 
 */
VerticalSlider.prototype.setValue = function(v){
    this.rangeInput.value = v;
}




extend(SliderGroup.prototype,StateComponent.prototype);
/**
 * 
 * @param {*} parentElement 
 * @param {*} numSliders 
 * @param {*} sliderClass 
 */
function SliderGroup(parentElement,numSliders,sliderClass){
    StateComponent.call(this);
    this.parentElement = parentElement;
    this.parentComponent;

    this.container = document.createElement("div");
    this.container.setAttribute("class","slider-group-container");

    this.sliderContainer = document.createElement("div");
    this.labelContainer = document.createElement("div");
    this.labelContainer.setAttribute("class","slider-group-label-container");

    this.container.appendChild(this.sliderContainer);
    this.container.appendChild(this.labelContainer);
    this.parentElement.appendChild(this.container);

    
    this.sliders = [];
    this.values = [];
    this.labels = [];

    for(let i = 0; i < numSliders; i++){
        let vs = new VerticalSlider(this.sliderContainer);
        vs.addParentGroup(this);
        vs.setComponentKey(i);
        this.sliders[i] = vs;
        this.values.push(0);
        
        let l = document.createElement("div");
         l.setAttribute("class","v-slider-label");
        l.innerHTML = (i+1).toString();
        this.labelContainer.appendChild(l);
        this.labels.push(l);
    }
}

/**
 * 
 * @param {*} obj 
 * @param {*} arg 
 */
SliderGroup.prototype.update = function(obj,arg){
    if(obj instanceof VerticalSlider){
        // sanity check to make sure slider is actually a registered child
        if(obj.componentKey >= 0){
            this.values[obj.componentKey] = this.sliders[obj.componentKey].getValue();

            let valChangeNotification = {
                "type" : "slider-group-value-change",
                "index" : obj.componentKey,
                "value" : this.values[obj.componentKey]
            }
            this.notify(valChangeNotification);
        }
    }

    else{
        this.notify();
    }
    
}

/**
 * 
 * @param {*} obj 
 */
SliderGroup.prototype.addParentComponent = function(obj){
    this.parentComponent = obj;
    this.parentComponent.observe(this);
}

/**
 * 
 */
SliderGroup.prototype.resetValues = function(){
    for(let i = 0; i < this.values.length; i++){
        this.values[i] = 0;
        this.sliders[i].setValue(0);     
    }
}

/**
 * 
 */
SliderGroup.prototype.randomizeValues = function(){
    for(let i = 0; i < this.values.length; i++){
        var v = Math.random();
        this.values[i] = v;
        this.sliders[i].setValue(v);
    }
}

/**
 * 
 */
SliderGroup.prototype.getValues = function(){
    return this.values;
}

/**
 * 
 * @param {*} values 
 */
SliderGroup.prototype.setValues = function(values){
    for(let i = 0; i < this.sliders.length; i++){
        if(values[i] !=undefined){
            this.setValue(i,values[i]);
        }
        
        else{
            this.setValue(i,0);
        }
    }    
}

/**
 * 
 * @param {*} index 
 * @param {*} value 
 */
SliderGroup.prototype.setValue = function(index, value){
    this.values[index] = value;
    this.sliders[index].setValue(value);
}




extend(SliderFloatController.prototype,StateComponent.prototype);
/**
 * A slider group with some extra controls
 * @param {*} parentElement 
 * @param {*} numSliders 
 * @param {*} sliderClass 
 */
function SliderFloatController(parentElement,numSliders,sliderClass){
    StateComponent.call(this);
    this.parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.setAttribute("class","slider-float-controller-container");

    this.dashboard = document.createElement("div");
    this.dashboard.setAttribute("class","slider-float-controller-dashboard");
    this.container.appendChild(this.dashboard);

    this.resetValuesButton = document.createElement("button");
    this.resetValuesButton.setAttribute("class","slider-float-controller-dashboard-reset-button");
    this.resetValuesButton.innerHTML = "X";

    this.randomValuesButton = document.createElement("button");
    this.randomValuesButton.setAttribute("class","slider-float-controller-dashboard-reset-button");
    this.randomValuesButton.innerHTML = "R";

    this.dashboard.appendChild(this.resetValuesButton);
    this.dashboard.appendChild(this.randomValuesButton);

    this.sliderGroup = new SliderGroup(this.container,numSliders,sliderClass);
    this.observe(this.sliderGroup);

    this.parentElement.appendChild(this.container);

    this.resetValuesButton.addEventListener("click",this.handle.bind(this));
    this.randomValuesButton.addEventListener("click",this.handle.bind(this));
}

/**
 * 
 * @param {*} e 
 */
SliderFloatController.prototype.handle = function(e){

    switch(e.target){
        case this.resetValuesButton : 
            this.resetValues();
        break;

        case this.randomValuesButton :
            this.randomizeValues();
        break;
    }
}

/**
 * 
 */
SliderFloatController.prototype.resetValues = function(){
    this.sliderGroup.resetValues();
    this.notify();
}

/**
 * 
 */
SliderFloatController.prototype.randomizeValues = function(){
    this.sliderGroup.randomizeValues();
    this.notify();
}

/**
 * 
 */
SliderFloatController.prototype.getValues = function(){
    return this.sliderGroup.getValues();
}

/**
 * 
 * @param {*} obj 
 * @param {*} arg 
 */
SliderFloatController.prototype.update = function(obj,arg){
    this.notify(arg);
}

/**
 * 
 * @param {*} values 
 */
SliderFloatController.prototype.setValues = function(values){
    this.sliderGroup.setValues(values);
}

/**
 * 
 * @param {*} index 
 * @param {*} value 
 */
SliderFloatController.prototype.setValue = function(index,value){
    this.sliderGroup.setValue(index,value);
}