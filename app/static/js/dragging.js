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
    // If source is sourcebox and target is newtargetbox or:
    // If source is usedtargetbox and and target is either a usedtargetbox
    // or a deletetargetbox,
    // then add the over class, but otherwise don't
    if ( 
      (dragSrcEl.classList.contains('sourcebox')
     && this.classList.contains('newtargetbox'))  || 

      (dragSrcEl.classList.contains('usedtargetbox')
     && (this.classList.contains('usedtargetbox') || 
     this.classList.contains('deletetargetbox')))) 
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

      // If source box was sourcebox,
      // then only allow action on newtargetbox,
      // which is to create a usedtargetbox
      if (dragSrcEl.classList.contains('sourcebox') ) {
        if (this.classList.contains('newtargetbox')) {

          var clone = this.cloneNode(true);
          this.draggable = true;
          this.classList.remove('newtargetbox')
          this.classList.add('usedtargetbox')

          // Update the target box's text with the dragged box's text
          this.innerHTML = e.dataTransfer.getData('text/plain');

          // Update the target box's id to this text as well
          this.id = e.dataTransfer.getData('text/plain');

          // Only add dropdown if the source was a measure function
          node_type = dragSrcEl.getAttribute('data-nodetype')

          if (node_type == 'measure_function') {
            // Add the dropdown div to this element as a child
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
            
            button.textContent = "Dropdown"
            dropdownDiv.appendChild(button)
            dropdownDiv.appendChild(select)

            this.appendChild(dropdownDiv)
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
        };
      };

      // If source box was usedtargetbox then only allow action
      // on usedtargetbox or removetargetbox
      if (dragSrcEl.classList.contains('usedtargetbox') ) {
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

  function toggleDropdown(elem) {
    let selectElem = elem.nextElementSibling;
    selectElem.classList.toggle('show')
  }

function updateNodeText(selectElem) {
  // Get the current text of the basenode
  let curText = selectElem.parentNode.parentNode.id
  // console.log(curText)
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
      newText += "( " + curText + " | " + "["
      newText += selectedStrs.join(',')
      newText += "] )"
    }
    else {
      newText = curText
    }
    
  }
  // console.log(newText)
  selectElem.parentNode.parentNode.childNodes[0].textContent = newText
  // [1].textContent = newText
  // let newText = 
    // let selectElem = elem.nextElementSibling;
    // selectElem.classList.toggle('show')
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

