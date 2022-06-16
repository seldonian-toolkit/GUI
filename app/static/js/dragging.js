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

    targitems.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    // Applies to both
    e.preventDefault();
    return false;
  }

  function handleDragEnterTarget(e) {
    // Applies only to target
    this.classList.add('over');
  }

  function handleDragLeaveTarget(e) {
    // Applies only to target
    this.classList.remove('over');
  }

  function handleDrop(e) {
    // Only applies to target
    e.stopPropagation(); // stops the browser from redirecting.

    if (dragSrcEl !== this) {

      // If the dragged source was already a target box, then swap its
      // text with the target
      if (dragSrcEl.classList.contains('targetbox') ) {
        dragSrcEl.innerHTML = this.innerHTML;
      }
      
      // Update the target box's text
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
    // // If source box was moved to target box (not target to target),
    // // then we need to make it a target box
    if (dragSrcEl.classList.contains('sourcebox') ) {
      this.classList.remove('sourcebox')
      this.classList.add('targetbox')
    }
  return false;
}

  let srcitems = document.querySelectorAll('.sourcebox');
  srcitems.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStartSource);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
  
  let targitems = document.querySelectorAll('.targetbox');
  targitems.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStartTarget);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnterTarget);
    item.addEventListener('dragleave', handleDragLeaveTarget);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });

});