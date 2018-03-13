extend(PresetManager.prototype,StateComponent.prototype);
/**
 * 
 * @param {*} parentElement 
 */
function PresetManager(parentElement){
    StateComponent.call(this);
    this.parentElement = parentElement;
  
    this.container = document.createElement("div");
    this.container.setAttribute("class","presetManagerContainer");
  
    this.titleDiv = document.createElement("div");
    this.titleDiv.setAttribute("class","presetManagerHeader");
    this.titleDiv.innerHTML = "Presets";
  
    this.presetList = document.createElement("div");
    this.presetList.setAttribute("class","presetManagerList");

    this.presets = {};
    this.presetItems = [];
  
    this.container.appendChild(this.titleDiv);
    this.container.appendChild(this.presetList);
    this.parentElement.appendChild(this.container);
}

/**
 * 
 * @param {*} name 
 * @param {*} sinePartials 
 * @param {*} cosPartials 
 * @param {*} curveFidelity 
 * @param {*} curveThickness 
 * @param {*} zoom 
 */
PresetManager.prototype.addPreset = function(name,sinePartials,cosPartials,sineFactor,cosFactor,curveFidelity,curveThickness,zoom){
    this.presets[name] = {
        name : name,
        sinePartials : sinePartials, 
        cosPartials : cosPartials,
        sineFactor : sineFactor,
        cosFactor : cosFactor,
        curveFidelity : curveFidelity,
        curveThickness : curveThickness,
        zoom : zoom
    }
    let pi = new PresetItem(this,name);
    this.observe(pi);
    this.presetItems.push(pi);
}

/**
 * 
 * @param {*} obj 
 * @param {*} arg 
 */
PresetManager.prototype.update = function(obj,arg){
    this.notify(this.presets[obj["name"]]);
}

/**
 * 
 * @param {*} stateComponent 
 */
PresetManager.prototype.manage = function(stateComponent){
    stateComponent.observe(this);
}



extend(PresetItem.prototype,StateComponent.prototype);
/**
 * 
 * @param {*} presetManager 
 */
function PresetItem(presetManager,name){
    StateComponent.call(this);
    this.element = document.createElement("div");
    this.element.setAttribute("class","presetItem");
    this.parentPresetManager = presetManager;
    this.name = name;
    this.element.innerHTML = name;

    this.parentPresetManager.presetList.appendChild(this.element);

    this.element.addEventListener("click",this.handle.bind(this));
}

PresetItem.prototype.handle = function(e){
    this.notify();
}