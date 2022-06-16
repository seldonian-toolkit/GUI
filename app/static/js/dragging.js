document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStartSource(e) {
    // Only applies to source 
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'copyMove';
    // e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragStartTarget(e) {
    // Only applies to target
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'Move';
    // e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
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
    // remove over class
    this.classList.remove('over');
    
    if (dragSrcEl !== this) {  

      
      // If source box was sourcebox,
      // then only allow action on newtargetbox 
      if (dragSrcEl.classList.contains('sourcebox') ) {
        if (this.classList.contains('newtargetbox')) {

          var clone = this.cloneNode(true);
          this.draggable = true;
          this.classList.remove('newtargetbox')
          this.classList.add('usedtargetbox')
          // Update the target box's text with the dragged box's text
          this.innerHTML = e.dataTransfer.getData('text/html');

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
          this.innerHTML = e.dataTransfer.getData('text/html');
        };
        if (this.classList.contains('deletetargetbox')) {
            // remove the source box
            dragSrcEl.remove()
        };
      };

    }
    
  return false;
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

