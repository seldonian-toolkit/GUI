function handleDragStartSource(e) {
  // Only applies to source
  e.stopPropagation() 
  this.style.opacity = '0.4';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'copyMove';
  // e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.innerHTML);
}

function handleDragStartTarget(e) {
  // Only applies to target
  e.stopPropagation()

  this.style.opacity = '0.4';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'Move';
  // e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.innerHTML);
}

function handleDragEnd(e) {
  // Applies to both
  this.style.opacity = '1';
}

function handleDragOver(e) {
  // Applies to both
  e.preventDefault();
  return false;
}

function handleDragEnter(e) {
  e.stopPropagation()
  // figure out source and target box class
  let source_box_class = getBoxClass(dragSrcEl)
  let target_box_class = getBoxClass(this)
  
  // figure out source and target node types:
  let source_node_type = dragSrcEl.getAttribute('data-nodetype')
  let target_node_type = this.getAttribute('data-nodetype')


  
  if ( 
      (
        source_box_class == 'sourcebox' &&
          (
            target_box_class == 'newtargetbox' || 
            target_node_type == 'math_function'
          )
      ) || 
   
      (
        source_box_class == 'usedtargetbox' && 
        (
          target_box_class == 'usedtargetbox' || 
          target_box_class == 'deletetargetbox'
        )
      )
    )
  {
    this.classList.add('over');
  }
};

function handleDragLeave(e) {
  // Applies only to target
  this.classList.remove('over');
}

function handleDrop(e) {
  // dragSrcEl is the dragged source and "this" is the target
  e.stopPropagation(); // stops the browser from redirecting.
  e.preventDefault();
  
  let source_box_class = getBoxClass(dragSrcEl);
  let target_box_class = getBoxClass(this);

  let source_node_type = dragSrcEl.getAttribute('data-nodetype')
  let target_node_type = this.getAttribute('data-nodetype')
  // remove "over" class
  this.classList.remove('over');
  
  if (dragSrcEl !== this) {  

    if (source_box_class == 'sourcebox' ) {
      
      if (target_box_class == 'newtargetbox') {
        var clone = this.cloneNode(true);

        this.draggable = true;
        this.classList.remove('newtargetbox')
        this.classList.add('usedtargetbox')
        
        this.setAttribute('data-nodetype',source_node_type)
        // Add button if the source was a math function
        // Add dropdown if the source was a measure function
        if (source_node_type == 'measure_function') {
          
          // Add the dropdown div to this element as a child
          regime = document.getElementById('regime').value
          
          if (regime == "supervised") {
            // Update the target box's text with the dragged box's text
            this.innerText = "";

            // Update the target box's id to this text as well
            this.id = e.dataTransfer.getData('text/plain');
            let dropdown = createDropdown(this);
            this.appendChild(dropdown);
          }
          else if (regime == "RL") {
            this.id = dragSrcEl.id
            // Update the target box's text with the dragged box's text
            this.innerText = e.dataTransfer.getData('text/plain');
          }
        }

        else if (source_node_type == 'math_function' ) {
          // Update the target box's text with the dragged box's text
          this.innerText = "";

          // Update the target box's id to this text as well
          this.id = e.dataTransfer.getData('text/plain');
          // Add the button div to this element as a child
          if (singleArgMathFuncs.includes(dragSrcEl.id)) {
            let button = createFunctionDisabledButton(this)
          }
          else {
            let button = createFunctionButton(this);
          }
          this.appendChild(button);
        }

        else {
          this.id = dragSrcEl.id
          // Update the target box's text with the dragged box's text
          this.innerText = e.dataTransfer.getData('text/plain');
        };
        // change the event listeners from source to usedtarget
        removeSourceBoxListeners(this);
        addUsedTargetBoxListeners(this);

        // create another newtargetbox so user can still add new node 
        // and add it to the DOM
        removeSourceBoxListeners(clone)
        removeUsedTargetBoxListeners(clone)
        addNewBoxListeners(clone)
        this.after(clone);
      }

      // If target box is usedtargetbox,
      // only allowed if target node type is a
      // math function 
      else if 
        (
          target_box_class == 'usedtargetbox' &&   
          target_node_type == 'math_function'
          )
      {
        
        // Create a new div inside of the parent div
        const newDiv = document.createElement('div');
        newDiv.draggable = true;
        newDiv.classList.add('usedtargetbox');
        
        // What was the source node type
        source_node_type = dragSrcEl.getAttribute('data-nodetype')
        newDiv.setAttribute('data-nodetype',source_node_type)

         // Only add dropdown if the source was a measure function
         // and Regime != "RL"
        node_type = dragSrcEl.getAttribute('data-nodetype')
      
        if (node_type == 'measure_function') {
          // Update the target box's text with the dragged box's text
          newDiv.innerText = "";

          // Update the target box's id to newDiv text as well
          newDiv.id = e.dataTransfer.getData('text/plain');
          // Add the dropdown div to newDiv element as a child
          let dropdown = createDropdown(newDiv);
          newDiv.appendChild(dropdown);
        }

        // Add button if the source was a math function
        else if (node_type == 'math_function') {
          // Update the target box's text with the dragged box's text
          newDiv.innerText = "";

          // Update the target box's id to newDiv text as well
          newDiv.id = e.dataTransfer.getData('text/plain');
          // Add the button div to newDiv element as a child
          let button = createFunctionButton(newDiv);
          newDiv.appendChild(button);
        }

        else {
          newDiv.innerText = e.dataTransfer.getData('text/plain')
        };
        // change the event listeners from source to usedtarget
        removeSourceBoxListeners(newDiv);
        addUsedTargetBoxListeners(newDiv);
        // Update the parent box's text with the dragged box's text
        // curText = this.innerHTML // should be something like "function()"
        // let newText = curText.slice(0,-1) + e.dataTransfer.getData('text/plain') + ")"
        // this.innerHTML = newText 
        this.appendChild(newDiv)
        formatComposition(this)
      }

      }

    else if (dragSrcEl.classList.contains('usedtargetbox') ) {
      if (this.classList.contains('usedtargetbox')) {
          // Update source box with target box's text and 
          // the target box's text with the dragged box's text
        dragSrcEl.innerHTML = this.innerHTML
        this.innerHTML = e.dataTransfer.getData('text/plain');
      };
      if (this.classList.contains('deletetargetbox')) {
          // remove the source box
          dragSrcEl.remove()
      };
    };

  };
  
return false;
};

function createBlock(node_type,node_value) {
  const blockDiv = document.createElement('div');
  blockDiv.draggable = true;
  blockDiv.classList.add('usedtargetbox');
  blockDiv.setAttribute('data-nodetype',node_type)

  if (node_type == 'constant') {
    blockDiv.innerText = node_value
  }

  if (node_type == 'math_operator') {
    blockDiv.innerText = node_value;
  }
  else if (node_type == 'measure_function') {
    blockDiv.innerText = "";

    // Update the target box's id to blockDiv text as well
    blockDiv.id = node_value
    
    // Add a dropdown div to blockDiv element as a child
    let dropdown = createDropdown(blockDiv);
    blockDiv.appendChild(dropdown);
  }
  else if (node_type == 'math_function') {
    blockDiv.innerText = "";
    // Update the target box's id to blockDiv text as well
    blockDiv.id = node_value;
    // Add the button div to blockDiv element as a child
    let button = createFunctionButton(blockDiv);
    blockDiv.appendChild(button);
  }
  addUsedTargetBoxListeners(blockDiv)
  return blockDiv
}

function createDropdown(elem) {
  // Create a dropdown menu and return it
  const dropdownDiv = document.createElement('div');
  dropdownDiv.classList.add('dropdown');
  
  // Create the select element which will initially be hidden
  select = document.createElement('select')
  select.classList.add(['dropdown-content'])
  select.setAttribute('multiple',true)
  select.addEventListener('change', function(){
      updateNodeText(this);
  });
  
  // Figure out what the current sensitive attributes are
  // and make select options out of them
  currAtrs = document.getElementById("sensitive_attrs-group").children[1].value
  if (currAtrs != '') {
    // split string into a list
    var atrArr = currAtrs.split(',');
    atrArr.forEach(function(atr) {
      var option = document.createElement("option");
      option.text = atr;
      option.value = atr;
      option.classList.add('dropdown-option')
      select.appendChild(option);
    });
  }
  
  button = document.createElement('button')
  button.type = "button"
  button.classList.add('edit-btn')
  button.addEventListener('click', function(){
      toggleDropdown(this);
  });
  
  button.textContent = elem.id
  dropdownDiv.appendChild(button)
  dropdownDiv.appendChild(select)

  return dropdownDiv
  };

function createFunctionDisabledButton(elem) {
  button = document.createElement('button')
  button.type = "button"
  button.classList.add('disabled-btn')
  button.addEventListener('click', function(){
      addArgument(elem);
  });
  
  button.textContent = elem.id
  return button
}

function createFunctionButton(elem) {
  button = document.createElement('button')
  button.type = "button"
  button.classList.add('newarg-btn')
  button.addEventListener('click', function(){
      addArgument(elem);
  });
  
  button.textContent = elem.id
  return button
}

function addArgument(elem) {
  // Add a comma at the end of the current 
  // arguments of the math function
  // find last usedtargetbox child 
  // and add a text node after it
  const children = elem.querySelectorAll(':scope >.usedtargetbox');
  if (children.length > 0) {
    // check to make sure that the last part of the argument
    // isn't ",)"
    // if that's the case then the last argument isn't filled out
    if (elem.lastChild.previousSibling.textContent != ',') {
      commaTextNode = document.createElement('div')
      commaTextNode.innerText = ","
      commaTextNode.classList.add('newtextnode')
      elem.insertBefore(commaTextNode,elem.lastChild)  
    }
    
  }
}

function getNumberChildNodes(parent) {
  const children = parent.querySelectorAll(':scope >div');
  return children.length
  };

function toggleDropdown(elem) {
    let selectElem = elem.nextElementSibling;
    selectElem.classList.toggle('show')
  }

function updateNodeText(selectElem) {
  // Get the current text of the basenode
  let parentDiv = selectElem.parentNode.parentNode
  let baseNodeStr = parentDiv.id
  
  let newText = "";

  // Loop through all selected options and update the text
  let options = select && select.options;
  let opt;
  let selectedStrs = [];

  if (options.length > 0) {

    for (let i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
      if (opt.selected) {
        selectedStrs.push(opt.text)
      }
    }

    if (selectedStrs.length > 0) {
      newText += "( " + baseNodeStr + " | " + "["
      newText += selectedStrs.join(',')
      newText += "] )"
    }
    else {
      newText = baseNodeStr
    }
    
  }
  // Update button text with new text
  let button = selectElem.previousElementSibling
  button.textContent = newText;
  }

function getBoxClass(elem) {
  let box_class 
  
  if (elem.classList.contains('sourcebox')) {
    box_class = 'sourcebox'
  }

  if (elem.classList.contains('usedtargetbox')) {
    box_class = 'usedtargetbox'
  }

  if (elem.classList.contains('newtargetbox')) {
    box_class = 'newtargetbox'
  }

  if (elem.classList.contains('usedtargetbox')) {
    box_class = 'usedtargetbox'
  }

  if (elem.classList.contains('deletetargetbox')) {
    box_class = 'deletetargetbox'
  }

  return box_class
  };

function formatComposition(elem) {
  // check if there is composition, i.e. we already 
  // formatted the parentheses before
  const firstChild = elem.firstChild
  const lastChild = elem.lastChild
  const prevSibling = lastChild.previousSibling
  if (prevSibling.innerText == ")") {
    // swap last two nodes
    elem.insertBefore(lastChild, prevSibling);
  }
  else {
    // This is the first composition
    // Remove the "()" in the math function node text
    curText = firstChild.innerText
    firstChild.innerText = curText.replace('()','')
    // Create a text node with open parentheses 
    // and put it right after the button
    openparenTextNode = document.createElement('div')
    openparenTextNode.innerText = "("
    openparenTextNode.classList.add('newtextnode')
    elem.insertBefore(openparenTextNode,firstChild.nextElementSibling)
    // Create a text node with closing parentheses
    // and put it at the end
    closeparenTextNode = document.createElement('div')
    closeparenTextNode.innerText = ")"
    closeparenTextNode.classList.add('newtextnode')
    elem.appendChild(closeparenTextNode)
  }
}

function addSourceBoxListeners(elem){
  elem.addEventListener('dragstart', handleDragStartSource);
  elem.addEventListener('dragover', handleDragOver);
  elem.addEventListener('dragend', handleDragEnd);
  elem.addEventListener('drop', handleDrop);
  };

function removeSourceBoxListeners(elem){
  elem.removeEventListener('dragstart', handleDragStartSource);
  elem.removeEventListener('dragover', handleDragOver);
  elem.removeEventListener('dragend', handleDragEnd);
  elem.removeEventListener('drop', handleDrop);
  };

function addUsedTargetBoxListeners(elem) {
    elem.addEventListener('dragstart', handleDragStartTarget);
    elem.addEventListener('dragover', handleDragOver);
    elem.addEventListener('dragenter', handleDragEnter);
    elem.addEventListener('dragleave', handleDragLeave);
    elem.addEventListener('dragend', handleDragEnd);
    elem.addEventListener('drop', handleDrop);
  };

function removeUsedTargetBoxListeners(elem) {
    elem.removeEventListener('dragstart', handleDragStartTarget);
    elem.removeEventListener('dragover', handleDragOver);
    elem.removeEventListener('dragenter', handleDragEnter);
    elem.removeEventListener('dragleave', handleDragLeave);
    elem.removeEventListener('dragend', handleDragEnd);
    elem.removeEventListener('drop', handleDrop);
  };

function addNewBoxListeners(elem) {
    elem.addEventListener('dragover', handleDragOver);
    elem.addEventListener('dragenter', handleDragEnter);
    elem.addEventListener('dragleave', handleDragLeave);
    elem.addEventListener('dragend', handleDragEnd);
    elem.addEventListener('drop', handleDrop);
  };

function removeNewBoxListeners(elem) {
    elem.addEventListener('dragover', handleDragOver);
    elem.addEventListener('dragenter', handleDragEnter);
    elem.addEventListener('dragleave', handleDragLeave);
    elem.addEventListener('dragend', handleDragEnd);
    elem.addEventListener('drop', handleDrop);
  };

function addDeleteBoxListeners(elem) {
    elem.addEventListener('dragover', handleDragOver);
    elem.addEventListener('dragenter', handleDragEnter);
    elem.addEventListener('dragleave', handleDragLeave);
    elem.addEventListener('dragend', handleDragEnd);
    elem.addEventListener('drop', handleDrop);
  };

// Initialize the listeners at runtime
var srcitems = document.querySelectorAll('.sourcebox');
srcitems.forEach(function(item) {
  addSourceBoxListeners(item); 
});

var newitems = document.querySelectorAll('.newtargetbox');
newitems.forEach(function(item) {
  addNewBoxListeners(item);
});


var deleteitems = document.querySelectorAll('.deletetargetbox');
deleteitems.forEach(function(item) {
  addDeleteBoxListeners(item);
});
  

var singleArgMathFuncs = ["abs()","exp()"]; 

  


