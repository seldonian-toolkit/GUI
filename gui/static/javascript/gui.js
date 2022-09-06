function regimeChange(regime_field) {
	let regime = regime_field.value;
	let subregime_field = document.getElementById("sub_regime-group");
	let subregime = document.getElementById("sub_regime").value;
	let env_module_field = document.getElementById("env_module-group");
	let env_class_field = document.getElementById("env_class-group");
	let agent_module_field = document.getElementById("agent_module-group");
	let agent_class_field = document.getElementById("agent_class-group");
	let sensitive_attrs_field = document.getElementById("sensitive_attrs-group");
	let label_column_field = document.getElementById("label_column-group");
	
	if (regime == "supervised_learning") {
		subregime_field.style.display = "block";
		sensitive_attrs_field.style.display = "block";
		label_column_field.style.display = "block";
		env_module_field.style.display = "none"
		env_class_field.style.display = "none"
		agent_module_field.style.display = "none"
		agent_class_field.style.display = "none"
		
		if (subregime == "classification") {
			var measure_functions_field = document.getElementById("classification_funcs");
			var other_measure_functions_field1 = document.getElementById("regression_funcs");
		}
		else {
			var measure_functions_field = document.getElementById("regression_funcs");
			var other_measure_functions_field1 = document.getElementById("classification_funcs")
		}
		var other_measure_functions_field2 = document.getElementById("RL_funcs");

	}

	else if (regime == "reinforcement_learning") {
		var measure_functions_field = document.getElementById("RL_funcs");
		var other_measure_functions_field1 = document.getElementById("classification_funcs");
		var other_measure_functions_field2 = document.getElementById("regression_funcs");
		subregime_field.style.display = "none";
		sensitive_attrs_field.style.display = "none";
		label_column_field.style.display = "none";
		env_module_field.style.display = "block"
		env_class_field.style.display = "block"
		agent_module_field.style.display = "block"
		agent_class_field.style.display = "block"

	}
	measure_functions_field.style.display = "block"
	other_measure_functions_field1.style.display = "none"
	other_measure_functions_field2.style.display = "none"
	}

function subregimeChange(subregime_field) {
	
	let sub_regime = subregime_field.value;
	if (sub_regime == "classification") {
		var measure_functions_field = document.getElementById("classification_funcs");
		var other_measure_functions_field1 = document.getElementById("regression_funcs");
	}
	else {
		var measure_functions_field = document.getElementById("regression_funcs");
		var other_measure_functions_field1 = document.getElementById("classification_funcs")
	}
	let other_measure_functions_field2 = document.getElementById("RL_funcs");
	
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

	resetConstraintButton = document.createElement('button')
  resetConstraintButton.type = "button"
  resetConstraintButton.classList.add('btn','btn-warning','resetconstraint-btn')
  resetConstraintButton.addEventListener('click', function(){
      resetConstraint(this);
  });
  
  resetConstraintButton.textContent = "Reset constraint"

	deleteConstraintButton = document.createElement('button')
  deleteConstraintButton.type = "button"
  deleteConstraintButton.classList.add('btn','btn-danger','deleteconstraint-btn')
  deleteConstraintButton.addEventListener('click', function(){
      deleteConstraint(this);
  });
  
  deleteConstraintButton.textContent = "Remove constraint"

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

  deltaDiv = document.createElement('div')
  deltaDiv.classList.add('mt-2','delta_container',
  	'form-control','form-control-lg','col-sm-5')
	label = document.createElement('label')
	label.classList.add('delta_label')
	label.for = "delta_constraint1"
	label.textContent = "Delta:"
	input = document.createElement('input')
	input.type = "text"
	input.id="delta_constraint1"
	
	deltaDiv.appendChild(label)
	deltaDiv.appendChild(input)


  targetDiv.appendChild(newTargetDiv)
  targetDiv.appendChild(newTextDiv)
  targetDiv.appendChild(newRemoveDiv)

  newConstraintDiv.appendChild(newHeader)
  newConstraintDiv.appendChild(targetDiv)
  newConstraintDiv.appendChild(deltaDiv)
  newConstraintDiv.appendChild(resetConstraintButton)
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

	};

function resetConstraint(elem) {
		// Make constraint blank
		// find parent node which is the constraint container
		let parent_container = elem.parentNode;
		// Get all children by .usedtargetbox class and delete them
		const elements = parent_container.getElementsByClassName("usedtargetbox");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    };
		// Re-number the constraints - amounts to changing the header names 
		// and the id of the constraint_container
		// let constraint_containers = document.querySelectorAll('.constraint_container');
		// for (let i=0, iLen=constraint_containers.length; i<iLen; i++) {
		// 	cc = constraint_containers[i]
		// 	cc.id = "constraint" + (i+1)
		// 	header = cc.querySelector('h5')
		// 	header.textContent = "Constraint #" + (i+1) + ":"
		// };

	};


function addPreconfiguredConstraint(radio) {
	// Add blocks to the first unfilled constraint 
	// (or add a new one) to make a constraint 
	// based on the radio button that the user selected

	// First make sure that there are at least two sensitive attributes
	let sensitive_attrs_field = document.getElementById('sensitive_attributes');
	let sensitive_attrs_str = sensitive_attrs_field.value;
	let sensitive_attrs_arr = sensitive_attrs_str.split(',');

	if (sensitive_attrs_arr.length < 2) {
		sensitive_attrs_field.value = "M,F"
	}
	
	// First loop through constraints and figure out first that's empty
	let constraint_containers = document.querySelectorAll('.constraint_container');
	let constraint_index_to_use = -1;
	for (let i=0, iLen=constraint_containers.length; i<iLen; i++) {
			cc = constraint_containers[i]
			// check if it has any usedtargetboxes  
			used_target_boxes = cc.querySelectorAll('.usedtargetbox')
			if (used_target_boxes.length == 0) {
				constraint_index_to_use = i
			}
	};
	// if none are empty then create a new constraint and use that
	if (constraint_index_to_use < 0) {
		addConstraintField()
		let constraint_containers = document.querySelectorAll('.constraint_container');
		var active_constraint_container = constraint_containers[constraint_containers.length-1]
	}
	else {
		var active_constraint_container = constraint_containers[constraint_index_to_use]
	};

	// Within the constraint container pick out the target grid container
	var target_grid_container = active_constraint_container.querySelector('.target_grid_container')
	let constraintName = radio.id
	if (constraintName == 'disparate_impact') {
		// 0.8 - min((PR | [M])/(PR | [F]),(PR | [F])/(PR | [M]))
		// constant
    const constantBlock = createBlock('constant',0.8)
    
    // minus
    const minusBlock = createBlock('math_operator','-')

		// min()
  	let minBlock = createBlock('math_function','min()')
		
		// PR | M
  	const prMBlock = createBlock('measure_function','PR')
    let select_M = prMBlock.querySelector('.dropdown-content')
    let options_M = select_M.querySelectorAll('option');
    options_M[0].selected = true
    updateNodeText(select_M)
    minBlock.appendChild(prMBlock);

    // Division symbol
    const divDiv = createBlock('math_operator','/')
    minBlock.appendChild(divDiv);

    // PR | F 
		const prFBlock = createBlock('measure_function','PR')
    let select_F = prFBlock.querySelector('.dropdown-content')
    let options_F = select_F.querySelectorAll('option');
    options_F[1].selected = true
    updateNodeText(select_F)
    minBlock.appendChild(prFBlock);
    formatComposition(minBlock)
    // Second argument
    addArgument(minBlock)
  //   // formatComposition(minBlock)

  //   // PR | F 
		const prFBlock2 = createBlock('measure_function','PR')
    let select_F2 = prFBlock2.querySelector('.dropdown-content')
    let options_F2 = select_F2.querySelectorAll('option');
    options_F2[1].selected = true
    updateNodeText(select_F2)
    minBlock.appendChild(prFBlock2);
    formatComposition(minBlock)
  //   // Division symbol
    const divBlock2 = createBlock('math_operator','/')
    minBlock.appendChild(divBlock2);
    formatComposition(minBlock)

  // //   // PR | M 
		const prMBlock2 = createBlock('measure_function','PR')
    let select_M2 = prMBlock2.querySelector('.dropdown-content')
    let options_M2 = select_M2.querySelectorAll('option');
    options_M2[0].selected = true
    updateNodeText(select_M2)
    minBlock.appendChild(prMBlock2);
    formatComposition(minBlock)

    // Add divs to target grid container
		target_grid_container.prepend(minBlock);
		target_grid_container.prepend(minusBlock);
		target_grid_container.prepend(constantBlock);
	}
	else if (constraintName == 'demographic_parity') {
		// abs((PR | [M]) - (PR | [F])) - 0.15

		// abs
		const absBlock = createBlock('math_function','abs()')

		// PR | M
		const prMBlock = createBlock('measure_function','PR')
		let select_M = prMBlock.querySelector('.dropdown-content')
    let options_M = select_M.querySelectorAll('option');
    options_M[0].selected = true
    updateNodeText(select_M)
    absBlock.appendChild(prMBlock);

    // minus
    const minusBlock = createBlock('math_operator','-')
    absBlock.appendChild(minusBlock)

    // PR | F
		const prFBlock = createBlock('measure_function','PR')
		let select_F = prFBlock.querySelector('.dropdown-content')
    let options_F = select_F.querySelectorAll('option');
    options_F[1].selected = true
    updateNodeText(select_F)
    absBlock.appendChild(prFBlock);

    formatComposition(absBlock)

    // minus
    const minusBlock2 = createBlock('math_operator','-')

    // constant
    const constantBlock = createBlock('constant',0.15)

    target_grid_container.prepend(constantBlock);
    target_grid_container.prepend(minusBlock2);
    target_grid_container.prepend(absBlock);
	}

	else if (constraintName == 'equal_opportunity') {
		// abs((FNR | [M]) - (FNR | [F])) - 0.2
		const absBlock = createBlock('math_function','abs()')

		// FNR | M
		const fnrMBlock = createBlock('measure_function','FNR')
		let select_M = fnrMBlock.querySelector('.dropdown-content')
    let options_M = select_M.querySelectorAll('option');
    options_M[0].selected = true
    updateNodeText(select_M)
    absBlock.appendChild(fnrMBlock);

    // minus
    const minusBlock = createBlock('math_operator','-')
    absBlock.appendChild(minusBlock)

    // FNR | F
		const fnrFBlock = createBlock('measure_function','FNR')
		let select_F = fnrFBlock.querySelector('.dropdown-content')
    let options_F = select_F.querySelectorAll('option');
    options_F[1].selected = true
    updateNodeText(select_F)
    absBlock.appendChild(fnrFBlock);

    formatComposition(absBlock)

    // minus
    const minusBlock2 = createBlock('math_operator','-')

    //constant
    const constantBlock = createBlock('constant',0.2)

    target_grid_container.prepend(constantBlock);
    target_grid_container.prepend(minusBlock2);
    target_grid_container.prepend(absBlock);
	}

	else if (constraintName == 'equalized_odds') {
		// abs((FNR | [M]) - (FNR | [F])) + abs((FPR | [M]) - (FPR | [F])) - 0.35

		// abs #1

		const absBlock = createBlock('math_function','abs()')

		// FNR | M
		const fnrMBlock = createBlock('measure_function','FNR')
		let select_M = fnrMBlock.querySelector('.dropdown-content')
    let options_M = select_M.querySelectorAll('option');
    options_M[0].selected = true
    updateNodeText(select_M)
    absBlock.appendChild(fnrMBlock);

    // minus
    const minusBlock = createBlock('math_operator','-')
    absBlock.appendChild(minusBlock)

    // FNR | F
		const fnrFBlock = createBlock('measure_function','FNR')
		let select_F = fnrFBlock.querySelector('.dropdown-content')
    let options_F = select_F.querySelectorAll('option');
    options_F[1].selected = true
    updateNodeText(select_F)
    absBlock.appendChild(fnrFBlock);

    formatComposition(absBlock)

    // plus
    const plusBlock = createBlock('math_operator','+')

    // abs #2

		const absBlock2 = createBlock('math_function','abs()')

		// FPR | M
		const fprMBlock = createBlock('measure_function','FPR')
		let select_M2 = fprMBlock.querySelector('.dropdown-content')
    let options_M2 = select_M2.querySelectorAll('option');
    options_M2[0].selected = true
    updateNodeText(select_M2)
    absBlock2.appendChild(fprMBlock);

    // minus
    const minusBlock2 = createBlock('math_operator','-')
    absBlock2.appendChild(minusBlock2)

    // FPR | F
		const fprFBlock = createBlock('measure_function','FPR')
		let select_F2 = fprFBlock.querySelector('.dropdown-content')
    let options_F2 = select_F2.querySelectorAll('option');
    options_F2[1].selected = true
    updateNodeText(select_F2)
    absBlock2.appendChild(fprFBlock);
    
    formatComposition(absBlock2)

    // minus
    const minusBlock3 = createBlock('math_operator','-')

    // constant

    const constantBlock = createBlock('constant',0.35)

    target_grid_container.prepend(constantBlock);
    target_grid_container.prepend(minusBlock3);
    target_grid_container.prepend(absBlock2);
    target_grid_container.prepend(plusBlock);
    target_grid_container.prepend(absBlock);
	}

	else if (constraintName == 'predictive_equality') {
		// abs((FPR | [M]) - (FPR | [F])) - 0.2

		const absBlock = createBlock('math_function','abs()')

		// FPR | M
		const fprMBlock = createBlock('measure_function','FPR')
		let select_M = fprMBlock.querySelector('.dropdown-content')
    let options_M = select_M.querySelectorAll('option');
    options_M[0].selected = true
    updateNodeText(select_M)
    absBlock.appendChild(fprMBlock);

    // minus
    const minusBlock = createBlock('math_operator','-')
    absBlock.appendChild(minusBlock)

    // fpr | F
		const fprFBlock = createBlock('measure_function','FPR')
		let select_F = fprFBlock.querySelector('.dropdown-content')
    let options_F = select_F.querySelectorAll('option');
    options_F[1].selected = true
    updateNodeText(select_F)
    absBlock.appendChild(fprFBlock);

    formatComposition(absBlock)

    // minus
    const minusBlock2 = createBlock('math_operator','-')

    //constant
    const constantBlock = createBlock('constant',0.2)

    target_grid_container.prepend(constantBlock);
    target_grid_container.prepend(minusBlock2);
    target_grid_container.prepend(absBlock);
	}
}

window.onclick = function(event) {
	// Handle when user clicks away from a dropdown or any of its items
  if (!event.target.matches(['.edit-btn', '.dropdown-option'])) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

$('[contenteditable="true"]').keypress(function(e) {
    var x = event.charCode || event.keyCode;
    if (isNaN(String.fromCharCode(e.which)) && x!=46 || x===32 || x===13 || (x===46 && event.currentTarget.innerText.includes('.'))) e.preventDefault();
});