function regimeChange(regime_field) {
	var regime = regime_field.value;
	let subregime_field = document.getElementById("sub-regime-group");
	let sensitive_attrs_field = document.getElementById("sensitive_attrs-group");
	
	if (regime == "supervised") {
		subregime_field.style.display = "block";
		sensitive_attrs_field.style.display = "block";
		var sub_regime = subregime_field.value;
		
		if (sub_regime == "classification") {
			var measure_functions_field = document.getElementById("classification_funcs");
			var other_measure_functions_field1 = document.getElementById("regression_funcs");
		}
		else {
			var measure_functions_field = document.getElementById("regression_funcs");
			var other_measure_functions_field1 = document.getElementById("classification_funcs")
		}
		var other_measure_functions_field2 = document.getElementById("RL_funcs");

	}

	else {
		var measure_functions_field = document.getElementById("RL_funcs");
		var other_measure_functions_field1 = document.getElementById("classification_funcs");
		var other_measure_functions_field2 = document.getElementById("regression_funcs");
		subregime_field.style.display = "none";
		sensitive_attrs_field.style.display = "none";
	}
	measure_functions_field.style.display = "block"
	other_measure_functions_field1.style.display = "none"
	other_measure_functions_field2.style.display = "none"
	}

function subregimeChange(subregime_field) {
	
	var sub_regime = subregime_field.value;
	if (sub_regime == "classification") {
		var measure_functions_field = document.getElementById("classification_funcs");
		var other_measure_functions_field1 = document.getElementById("regression_funcs");
	}
	else {
		var measure_functions_field = document.getElementById("regression_funcs");
		var other_measure_functions_field1 = document.getElementById("classification_funcs")
	}
	var other_measure_functions_field2 = document.getElementById("RL_funcs");
	
	measure_functions_field.style.display = "block"
	other_measure_functions_field1.style.display = "none"
	other_measure_functions_field2.style.display = "none"
	};

function addConstraintField() {
	// Add another target_grid_container div

	// First figure out how many target grid containers are already in the document
	let constraint_containers = document.querySelectorAll('.constraint_container');
	let last_constraint_container = constraint_containers[constraint_containers.length - 1]
	let parentNode = last_constraint_container.parentNode
	let n_constraints = constraint_containers.length
	let new_container_id = "constraint" + (n_constraints+1)

	newConstraintDiv = document.createElement('div');
  newConstraintDiv.id = new_container_id;
  newConstraintDiv.classList.add('constraint_container')

	newHeader = document.createElement('h5')
	newHeader.classList.add('mt-2')
	newHeader.textContent = "Constraint #" + (n_constraints+1) + ":"

	deleteConstraintButton = document.createElement('button')
  deleteConstraintButton.type = "button"
  deleteConstraintButton.classList.add('btn','btn-danger','deleteconstraint-btn')
  deleteConstraintButton.addEventListener('click', function(){
      deleteConstraint(this);
  });
  
  deleteConstraintButton.textContent = "Remove this constraint"

	targetDiv = document.createElement('div');
  targetDiv.classList.add('target_grid_container');
  targetDiv.id = new_container_id;

  newTargetDiv = document.createElement('div');
  newTargetDiv.classList.add('newtargetbox');
  newTargetDiv.textContent = "Drag block here to add";
  addNewBoxListeners(newTargetDiv);

  newTextDiv = document.createElement('div');
  newTextDiv.classList.add('newtextnode','ml-4');
  newTextDiv.textContent = '$$ \\leq 0 $$';
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, newTextDiv]);
  
	newRemoveDiv = document.createElement('div');
  newRemoveDiv.classList.add('deletetargetbox','ml-4');
  newRemoveDiv.textContent = "Drag block here to remove"

  targetDiv.appendChild(newTargetDiv)
  targetDiv.appendChild(newTextDiv)
  targetDiv.appendChild(newRemoveDiv)

  newConstraintDiv.appendChild(newHeader)
  newConstraintDiv.appendChild(targetDiv)
  newConstraintDiv.appendChild(deleteConstraintButton)

  parentNode.insertBefore(newConstraintDiv, last_constraint_container.nextSibling);
	};

function deleteConstraint(elem) {
		elem.parentNode.remove();
		// Re-number the constraints - amounts to changing the header names 
		// and the id of the constraint_container
		let constraint_containers = document.querySelectorAll('.constraint_container');
		for (let i=0, iLen=constraint_containers.length; i<iLen; i++) {
			cc = constraint_containers[i]
			cc.id = "constraint" + (i+1)
			header = cc.querySelector('h5')
			header.textContent = "Constraint #" + (i+1) + ":"
		};

	}

window.onclick = function(event) {
	// Handle when user clicks away from a dropdown or any of its items
  if (!event.target.matches(['.edit-btn', '.dropdown-option'])) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
