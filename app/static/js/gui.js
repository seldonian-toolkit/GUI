function regimeChange(regime_field) {
	var regime = regime_field.value;
	let subregime_field = document.getElementById("sub-regime");
	let sensitive_attrs_field = document.getElementById("sensitive_attrs");
	
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
	let target_grid_containers = document.querySelectorAll('.target_grid_container');
	let last_target_grid_container = target_grid_containers[target_grid_containers.length -1]
	let parentDiv = last_target_grid_container.parentNode
	let n_containers = target_grid_containers.length
	let new_container_id = "target_grid_container" + (n_containers+1)
	newHeader = document.createElement('h5')
	newHeader.classList.add('mt-4')
	newHeader.textContent = "Constraint #" + (n_containers+1) + ":"

	newDiv = document.createElement('div');
  newDiv.classList.add('target_grid_container');
  newDiv.id = new_container_id;

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


  newDiv.appendChild(newTargetDiv)
  newDiv.appendChild(newTextDiv)
  newDiv.appendChild(newRemoveDiv)

  // Get the form as the parent to add this newDiv to
  // let form = document.forms[0]
  parentDiv.insertBefore(newDiv, last_target_grid_container.nextSibling);
  parentDiv.insertBefore(newHeader, newDiv);
		
	};


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
