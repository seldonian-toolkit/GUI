document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStartSource(e) {
    // Only applies to source 
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'copyMove';
    // e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.innerHTML);
  }

  function handleDragStartTarget(e) {
    // Only applies to target
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

    // figure out source and target box class
    let source_box_class = getBoxClass(dragSrcEl)
    let target_box_class = getBoxClass(this)
    
    // figure out source and target node types:
    source_node_type = dragSrcEl.getAttribute('data-nodetype')
    target_node_type = this.getAttribute('data-nodetype')
    // If source is sourcebox and target is newtargetbox or
    // a usedtargetbox that is a math function
    
    // If source is usedtargetbox and target is either a usedtargetbox
    // or a deletetargetbox,
    // then add the over class, but otherwise don't
    if ( 
      ((source_box_class == 'sourcebox' && source_node_type) ||
      (source_node_type == 'measure_function' && target_node_type == 'math_function')) || 
     
      (source_box_class == 'usedtargetbox' && 
        (target_box_class == 'usedtargetbox' || target_box_class == 'deletetargetbox'))
      )
     {
      this.classList.add('over');
    }
  }

  function handleDragLeave(e) {
    // Applies only to target
    this.classList.remove('over');
  }

  function handleDrop(e) {
    // dragSrcEl is the dragged source and "this" is the target
    e.stopPropagation(); // stops the browser from redirecting.
    
    // remove "over" class
    this.classList.remove('over');
    
    if (dragSrcEl !== this) {  

      // If source box is sourcebox
      if (dragSrcEl.classList.contains('sourcebox') ) {
        // If target box is newtargetbox
        if (this.classList.contains('newtargetbox')) {

          var clone = this.cloneNode(true);

          this.draggable = true;
          this.classList.remove('newtargetbox')
          this.classList.add('usedtargetbox')
          source_node_type = dragSrcEl.getAttribute('data-nodetype')
          this.setAttribute('data-nodetype',source_node_type)

          // Update the target box's text with the dragged box's text
          this.innerText = "";

          // Update the target box's id to this text as well
          this.id = e.dataTransfer.getData('text/plain');

          // Only add dropdown if the source was a measure function
          node_type = dragSrcEl.getAttribute('data-nodetype')

          if (node_type == 'measure_function') {
            // Add the dropdown div to this element as a child
            let dropdown = createDropdown(this);
            this.appendChild(dropdown);
          }
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
        // only allowed if source box is a base node and 
        // target box is a math function, e.g. min(PR) is allowed
        else if (this.classList.contains('usedtargetbox')) {
          if ((dragSrcEl.getAttribute('data-nodetype') == 'measure_function') && 
            (this.getAttribute('data-nodetype') == 'math_function')) {
              console.log("Attempting a composition")
              // // A a new div inside of the div
              // const newDiv = document.createElement('div');
              // newDiv.classList.add('nestedusedtargetbox');

              // source_node_type = dragSrcEl.getAttribute('data-nodetype')
              // newDiv.setAttribute('data-nodetype',source_node_type)

              // Update the parent box's text with the dragged box's text
              curText = this.innerHTML // should be something like "function()"
              let newText = curText.slice(0,-1) + e.dataTransfer.getData('text/plain') + ")"
              this.innerHTML = newText 
              // this.appendChild(newDiv)
            }
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

    }
    
  return false;
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
  currAtrs = document.getElementById("sensitive_attrs").children[1].value
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
  button.classList.add('dropbtn','edit-btn')
  button.addEventListener('click', function(){
      toggleDropdown(this);
  });
  
  button.textContent = elem.id
  dropdownDiv.appendChild(button)
  dropdownDiv.appendChild(select)

  return dropdownDiv
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
  // 
  let button = selectElem.previousElementSibling
  button.textContent = newText;
  // console.log(newText)
  // selectElem.parentNode.parentNode.childNodes[0].textContent = newText
  // [1].textContent = newText
  // let newText = 
    // let selectElem = elem.nextElementSibling;
    // selectElem.classList.toggle('show')
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
let srcitems = document.querySelectorAll('.sourcebox');
srcitems.forEach(function(item) {
  addSourceBoxListeners(item); 
});

let newitems = document.querySelectorAll('.newtargetbox');
newitems.forEach(function(item) {
  addNewBoxListeners(item);
});


let deleteitems = document.querySelectorAll('.deletetargetbox');
deleteitems.forEach(function(item) {
  addDeleteBoxListeners(item);
});
  

  

  

  }); // end of file

