
const content = document.getElementById("details_content");
const btnDetails = document.getElementById("details");



btnDetails.addEventListener("click", function(event) {
	show();
});
function show() {
	content.classList.add("active_details")
	}


