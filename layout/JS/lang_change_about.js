
const aboutRu = document.getElementById("about_lang_ru");
const aboutEn = document.getElementById("about_lang_en");
const selectEnBtn = document.getElementById("en_lang_about");
const selectRuBtn = document.getElementById("ru_lang_about");



selectRuBtn.addEventListener("click", function(event) {
	AboutlangChangeRu();
});
function AboutlangChangeRu() {
	aboutRu.classList.add("active_lang")
	aboutEn.classList.add("disactive_lang")
	}

selectEnBtn.addEventListener("click", function(event) {
	AboutlangChangeEn();
});
function AboutlangChangeEn() {
	aboutEn.classList.remove("disactive_lang")
	aboutRu.classList.remove("active_lang")
	}


