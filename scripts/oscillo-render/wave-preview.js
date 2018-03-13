function mapValue(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


extend(WavePreviewGraph.prototype,StateComponent.prototype);
/**
 * A WavePreviewGraph. Displays a harmonic function as a co-domain of the x-axis. More or less just a graph plotter - but less re-usable. :S
 * @param {*} ySource - The co-domain source for this WavePreviewGraph.
 * @param {*} type - The type of harmonic function this WavePreviewGraph should preview (cosine vs. sine)
 * @param {*} svgCanvas - The SVGCanvas this WavePreviewGraph should draw on.
 */
function WavePreviewGraph(ySource,type,svgCanvas){
    StateComponent.call(this);
    this.svgCanvas = svgCanvas;
    this.type = type;
    this.ySource = ySource;
    this.curve = this.svgCanvas.PolyLine([]);
    this.observe(this.ySource);

    for(let i = 0; i < 200; i++){
        this.curve.addPoint(0,0);
    }
}

/**
 * Update method called by Subjects this WavePreviewGraph is observing. Filters and handles the update calls based on passed object references and arguments.
 * @override
 * @param {Object} obj - Notifying object
 * @param {any} arg - Special messages!!!
 */
WavePreviewGraph.prototype.update = function(obj,arg){
    let c = 0;
  
    let boundWidth = this.svgCanvas.getWidth();
    let boundHeight = this.svgCanvas.getHeight();
  
    let two_pi = Math.PI*2;
  
    let psum = this.ySource.getPartialSum();

    for(let t = 0.0; t < two_pi-(two_pi/200); t+=two_pi/200){
        let x = mapValue(t,0.0,two_pi,4,boundWidth-4);
        let j = mapValue(t,0.0,two_pi,4,boundWidth-4);
        let y;

        if(this.type == "sine"){
            y = mapValue(this.ySource.getValueAtParameter(t,"sine"),-psum,psum, boundHeight-4,4);
        }

        else{
            y = mapValue(this.ySource.getValueAtParameter(t,"cos"),-psum,psum,boundHeight-4,4);
        }

        // mozilla doesn't like zero...?
        if(psum > 0){
            this.curve.setPoint(c,x,y);
        }
        else{
            this.curve.setPoint(c,x,0);
        }
        
        c++;
    }   
}


