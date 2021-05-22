const infoList = document.getElementById("side_bar_info");
const infoBtn = document.getElementById("desktop_inf");
const line = document.getElementById("info_line");



infoBtn.addEventListener("click", function(event) {
	infoOpenDesktop();
});
function infoOpenDesktop() {
	infoList.classList.add("active_info");
	infoBtn.classList.add("active_inf");
	line.classList.add("active_line");
	}