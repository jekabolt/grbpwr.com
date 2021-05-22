
const menuBtn = document.getElementById("menu_btn");
const sideBar = document.getElementById("side_bar");
const menuBtnHide = document.getElementById("menu_btn_hide");
const BG = document.getElementById("bg");


menuBtn.addEventListener("click", function(event) {
	open();
});
function open() {
	sideBar.classList.add("active_side_bar")
}


menuBtnHide.addEventListener("click", function(event) {
	hide();
});
function hide() {
	sideBar.classList.remove("active_side_bar")
}


BG.addEventListener("click", function(event) {
	hide();
});


document.addEventListener('keydown', function(event){
	hide();
});
