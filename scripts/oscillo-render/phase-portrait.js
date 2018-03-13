function mapValue(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


extend(PhasePortrait.prototype,StateComponent.prototype);
/**
 * Displays a the correlation/phase portrait produced by two signal sources.
 * @param {HarmonicSummator} xSource - Domain signal source.
 * @param {HarmonicSummator} ySource - Co-domain signal source.
 * @param {CurveViewController} curveController - Collaborator CurveViewController.
 * @param {SVGCanvas} svgCanvas - SVGCanvas this PhasePortrait will draw on.
 */
function PhasePortrait(xSource,ySource,curveController,svgCanvas){
    StateComponent.call(this);
    this.xSource = xSource;
    this.ySource = ySource;
    this.curveController = curveController;
    this.svgCanvas = svgCanvas;

    // observe relevant controllers
    this.observe(xSource);
    this.observe(ySource);
    this.observe(curveController);

    // initialize polylines that this component will drive
    this.outerCurve = svgCanvas.PolyLine([]);
    this.innerCurve = svgCanvas.PolyLine([]);

    // various curve appearance parameters
    this.fidelity = 2000;
    this.thickness = 1;
    this.zoom = 10;
    
    // initialize polyline in the corner (hehe)
    for(let i = 0; i <= this.fidelity; i++){
      this.outerCurve.addPoint(0,0);
      this.innerCurve.addPoint(0,0);
    }
    
    // set polyline appearance
    this.outerCurve.strokeWeight(this.thickness);
    this.innerCurve.strokeWeight(this.thickness-1);
    this.innerCurve.stroke("darkgrey");
}

/**
 * Update method called by Subjects this PhasePortrait is observing. Filters and handles the update calls based on passed object references and arguments.
 * @override
 * @param {Object} obj - Notifying object
 * @param {any} arg - Special messages!!!
 */
PhasePortrait.prototype.update = function(obj,arg){

    switch(obj){
        case this.xSource:
            this.drawCurve();
        break;

        case this.ySource:
            this.drawCurve();
        break;

        case this.curveController:
            if(arg){
                if(arg === "Curve Thickness Change"){
                    this.thickness = this.curveController.getCurveThickness();
                    this.outerCurve.strokeWeight(this.thickness);
                    this.innerCurve.strokeWeight(this.thickness-1);
                }

                else if(arg === "Curve Fidelity Change"){    
                    this.fidelity = this.curveController.getCurveFidelity();
                    this.reset();
                    this.drawCurve();
                }

                else if(arg === "Zoom Change"){
                    this.zoom = this.curveController.getZoom(); 
                    this.drawCurve();
                }

                else if(arg === "Preset Application"){
                    this.thickness = this.curveController.getCurveThickness();
                    this.fidelity = this.curveController.getCurveFidelity();
                    this.zoom = this.curveController.getZoom();
                    this.outerCurve.strokeWeight(this.thickness);
                    this.innerCurve.strokeWeight(this.thickness-1);
                    this.reset();
                    this.drawCurve();
                }  
            }


        break;
    }

}

/**
 * Draws this PhasePortrait's curve.
 */
PhasePortrait.prototype.drawCurve = function(){
    let two_pi = Math.PI*2;

    let inc = two_pi/this.fidelity;

    for(let i = 0; i <= this.fidelity; i++){
        let t = i*inc;
        let x = this.xSource.getValueAtParameter(t,"sine");
        let y = this.ySource.getValueAtParameter(t,"cos");

        let boundWidth = this.svgCanvas.getWidth();
        let boundHeight = this.svgCanvas.getHeight();

        let mX = boundWidth/2;
        let mY = boundHeight/2;

        let zP = (mapValue(this.zoom,10,500,0,1)*boundHeight)/2;

        this.innerCurve.setPoint(i,x*zP+mX,y*zP+mY);
        this.outerCurve.setPoint(i,x*zP+mX,y*zP+mY);
    }
}

/**
 * Resets this PhasePortrait's curve.
 */
PhasePortrait.prototype.reset = function(){
    this.innerCurve.reset();
    this.outerCurve.reset();
  
    for(let i = 0; i <= this.fidelity; i++){
      this.outerCurve.addPoint(0,0);
      this.innerCurve.addPoint(0,0);
    }
}