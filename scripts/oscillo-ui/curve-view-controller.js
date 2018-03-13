extend(CurveViewController.prototype,StateComponent.prototype);
/**
 * A CurveViewController. Controls and displays some parameter details for a curve.
 * @param {*} parentElement 
 */
function CurveViewController(parentElement){
    StateComponent.call(this);

    this.controllerGroup = new NumericSetController(parentElement);
    this.controllerGroup.addController("Curve Thickness",1,15);
    this.controllerGroup.addController("Curve Fidelity",16,4000);
    this.controllerGroup.addController("Zoom",10,500);
    this.controllerGroup.getController("Curve Fidelity").setNumericType("int");
    this.controllerGroup.setValue("Curve Fidelity",2000);
    this.observe(this.controllerGroup);
}

/**
 * Update method called by Subjects this CurveViewController is observing. Filters and handles the update calls based on passed object references and arguments.
 * @override
 * @param {Object} obj - Notifying object
 * @param {any} arg - Special messages!!!
 */
CurveViewController.prototype.update = function(obj,arg){

    if(obj instanceof PresetManager){
        if(arg){
            this.controllerGroup.setValue("Curve Thickness",arg["curveThickness"]);
            this.controllerGroup.setValue("Curve Fidelity", arg["curveFidelity"]);
            this.controllerGroup.setValue("Zoom", arg["zoom"]);
            this.notify("Preset Application");
        }
    }

    switch(obj){
        case this.controllerGroup :
            this.notify(arg + " Change");
        break;

        default:
        break;
    }
    
}

/**
 * Get the current curve thickness parameter of this controller.
 */
CurveViewController.prototype.getCurveThickness = function(){
    return this.controllerGroup.getValue("Curve Thickness");
}

/**
 * Get the current curve fidelity parameter of this controller.
 */
CurveViewController.prototype.getCurveFidelity = function(){
    return this.controllerGroup.getValue("Curve Fidelity");
}

/**
 * Get the current zoom parameter of this controller.
 */
CurveViewController.prototype.getZoom = function(){
    return this.controllerGroup.getValue("Zoom");
}

