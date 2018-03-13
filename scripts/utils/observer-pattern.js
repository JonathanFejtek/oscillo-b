//*******************************************************************************************************// */
// Polymorphism Helpers //

function inheritPrototype(child,parent){
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

function extend(destination, source) {
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }
    return destination; 
}

//*****************************************************************************************************// */

/**
 * An Observer Object.
 * Has an update function.
 * For all intents and purposes, this is an psuedo-interface.
 */
function Observer(){}

/**
 * 'Abstract' update method. Called by subjects this observer may be observing.
 */
Observer.prototype.update = function(obj){}

/**
 * Sets this Observer to observe a specified subject.
 * @param {*object} subject 
 */
Observer.prototype.observe = function(subject){
    if(subject.addObserver){
        subject.addObserver(this);
    }
}

/**
 * A subject object. 
 * Maintains a list of observers, and manages registration and deregistration of observing objects.
 */
function Subject(){
    this.observers = [];
}

/**
 * Adds an observer to this subject.
 * @param {*object} obj 
 */
Subject.prototype.addObserver = function(obj){
    if(!this.hasObserver(obj)){
        this.observers.push(obj);
    }   
}

/**
 * Removes an observer from this object.
 * @param {*observer} observer 
 */
Subject.prototype.removeObserver = function(observer){
    this.observers.splice(this.observers.indexOf(observer));
}

/**
 * Returns true iff this subject has specified object as an observer.
 * @param {*object} obj 
 */
Subject.prototype.hasObserver = function(obj){
    return this.observers.indexOf(obj) >-1;
}

/**
 * Notify observers of state change in this subject.
 */
Subject.prototype.notify = function(arg){
    for(var i = 0; i < this.observers.length; i++){
        this.observers[i].update(this,arg);
    }
}


/**
 * A StateComponent Object.
 * Both an Observer and a Subject.
 */
function StateComponent(){
    Observer.call(this);
    Subject.call(this);
}

//multiple inheritance
extend(StateComponent.prototype,Observer.prototype);
extend(StateComponent.prototype,Subject.prototype);