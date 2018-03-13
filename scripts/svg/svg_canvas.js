var NS_SVG = "http://www.w3.org/2000/svg";

function removeItem(item,array){
  var index = array.indexOf(item);
  if(index > -1){
    return array.splice(index,1);
  }
}

function parsePercentage(p){
  if(typeof p == 'string'){
      if(p.indexOf('%')>-1){
          var percent = parseInt(p.substr(0,p.length-1));
          return percent;
      }
  }
  return null;
}





function SVGCanvas(width, height,containerId){
  this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.svg.setAttribute("version", "1.1");
  this.svg.setAttribute("id", "mysvg");
  // this.svg.setAttribute("width", width);
  // this.svg.setAttribute("height", height);
  this.childElements = [];

  this.fractionalWidth;
  this.fractionalHeight;

//---------------
  if(typeof width == "string"){
      if(width.indexOf('%')>-1){
         var percent = parseInt(width.substr(0,width.length-1));
         this.fractionalWidth = percent/100;
     }   
  }

  else{
    this.svg.setAttribute("width", width);
  }

  if(typeof height == 'string'){
      if(height.indexOf('%')>-1){
          var percent = parseInt(height.substr(0,height.length-1));
          this.fractionalHeight = percent/100;
      }
  }

  else{
      this.svg.setAttribute("height", height);
  }
//---------------


  if(typeof containerId == "string"){
    this.container = document.getElementById(containerId);
  }

  else{
    //it should be another canvas
    this.container = containerId.svg;
  }

  this.width = width;
  this.height = height;

  this.container.appendChild(this.svg);


  this.Circle = function(xPos,yPos,radius){
    var circle = new Circle(xPos,yPos,radius,this.svg);
    this.svg.appendChild(circle.getSVG());
    this.childElements.push(circle);
    return circle;
  }

  this.Line = function(x1,y1,x2,y2){
    var line = new Line(x1,y1,x2,y2,this.svg);
    this.svg.appendChild(line.getSVG());
    this.childElements.push(line);
    return line;
  }

  this.Rect = function(x,y,width,height){
    var rect = new Rect(x,y,width,height);
    this.svg.appendChild(rect.getSVG());
    this.childElements.push(rect);
    return rect;
  }

  this.PolyLine = function(coordinateList){
    var polyLine = new PolyLine(this.svg);
    this.svg.appendChild(polyLine.getSVG());

    if(coordinateList.length > 0){
      for(var i = 0; i < coordinateList.length; i++){
        var c = coordinateList[i];
        polyLine.addPoint(c[0],c[1]);
      }
    }
    this.childElements.push(polyLine);
    return polyLine;
  }

  this.Polygon = function(coordinateList){
    var polygon = new Polygon(this.svg);
    this.svg.appendChild(polygon.getSVG());

    if(coordinateList.length > 0){
      for(var i = 0; i < coordinateList.length; i++){
        var c = coordinateList[i];
        polygon.addPoint(c[0],c[1]);
      }
    }
    this.childElements.push(polygon);
    return polygon;
  }

  this.Curve = function(coordinateList){
    var curve = new Curve(this.svg);
    this.svg.appendChild(curve.getSVG());
    // if(coordinateList.length > 0){
    //   for(var i = 0; i < coordinateList.length; i++){
    //     var c = coordinateList[i];
    //     polygon.addPoint(c[0],c[1]);
    //   }
    // }
    this.childElements.push(curve);
    return curve;
  }

  this.getPos = function(){
    var x = this.svg.getBoundingClientRect().x;
    var y = this.svg.getBoundingClientRect().y;

    return [x,y];
  }

  this.deleteElement = function(element){
    this.svg.removeChild(element.getSVG());
    element.getSVG().remove();
    removeItem(element,this.childElements);
  }

  this.clear = function(){
    while(this.childElements.length > 0){
      this.deleteElement(this.childElements[0]);
    }
  }

  this.getWidth = function(){
    return this.width;
  }

  this.getHeight = function(){
    return this.height;
  }

  this.computeHeight = function(){
    this.height = this.svg.getBoundingClientRect().height;
    // console.log(this.svg.getBoundingClientRect());
  }

  this.computeWidth = function(){
    this.width = this.svg.getBoundingClientRect().width;
  }

  this.handleResize = function(){
    var bc = this.container.getBoundingClientRect();

    if(this.fractionalWidth){
      this.svg.setAttribute("width",this.fractionalWidth*bc.width);
    }

    if(this.fractionalHeight){
      this.svg.setAttribute("height",this.fractionalHeight*this.svg.getAttribute("width"));
    }
    this.computeWidth();
    this.computeHeight();
  }
}
