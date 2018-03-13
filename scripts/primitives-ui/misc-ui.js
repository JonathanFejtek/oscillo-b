extend(ToggleButton.prototype,StateComponent.prototype);
/**
 * A ToggleButton Component. Constructs a labeled toggle button in the specified HtmlDivElement. Extends StateComponent, and thus can communicate with other StateComponents via observe(), notify() and update().
 * @param {HtmlDivElement} parentElement - The parent HtmlDivElement of the ToggleButton.
 * @param {number} width - The width of toggle button.
 * @param {number} height - The height of the toggle button.
 * @param {string} label - The label for the toggle button.
 */
function ToggleButton(parentElement,width,height,label){
    StateComponent.call(this);
    this.parentElement = parentElement;
    this.toggled = false;

    // create component container
    this.container = document.createElement("div");
    this.container.setAttribute("class","toggle-button-container");

    // create component label
    this.label = document.createElement("h5");
    this.label.setAttribute("class","toggle-botton-label");

    // set label content
    if(label){
        this.label.innerHTML = label;
    }

    // create button element
    this.button = document.createElement("div");
    this.button.setAttribute("class","toggle-button");
    this.button.style.width = width;
    this.button.style.height = height;

    // define component hierarchy and insert component into parent element
    this.container.appendChild(this.label);
    this.container.appendChild(this.button);
    this.parentElement.appendChild(this.container);

    this.button.addEventListener("click",this.handle.bind(this));
}

/**
 * Handle a click from this on this ToggleButton's 'button' element.
 * @param {Event} e - Event to handle.
 */
ToggleButton.prototype.handle = function(e){
    this.toggle();
}

/**
 * Toggle this ToggleButton's 'toggled' state. If toggled, toggle off, if not toggled, toggle on.
 */
ToggleButton.prototype.toggle = function(){
    if(this.toggled){
        this.toggled = false;
        this.button.classList.remove("toggle-button-toggled");
    }
    else{
        this.toggled = true;
        this.button.classList.add("toggle-button-toggled");
    }
    this.notify();
}