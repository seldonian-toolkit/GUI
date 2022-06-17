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
	}


$(function() {
		// Listens for change in any of the dropdowns there could be
    $('.dropdown-content').change(function(e) {
    		// need to know parent div so we can modify node text
    		usedTargetNode = e.currentTarget.parentNode.parentNode
    		usedTargetNode.innerHTML = "TEST" + usedTargetNode.innerHTML
        var selected = $(e.target).val();
        // console.log(selected)
        // selected.forEach(function(item) {
        // 	// console.log(item);
        // })

    }); 
});


window.onclick = function(event) {
	// Handle when user clicks away from a dropdown or any of its items
  if (!event.target.matches(['.dropbtn', '.dropdown-option'])) {
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