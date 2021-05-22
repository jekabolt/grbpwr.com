const shippingRu = document.getElementById("shipping_ru");
const shippingEn = document.getElementById("shipping_en");
const selectEnBtn = document.getElementById("en_lang_shipping");
const selectRuBtn = document.getElementById("ru_lang_shipping");



selectRuBtn.addEventListener("click", function(event) {
	langChangeRu();
});
function langChangeRu() {
	shippingRu.classList.add("active_lang")
	shippingEn.classList.add("disactive_lang")
	}

selectEnBtn.addEventListener("click", function(event) {
	langChangeEn();
});
function langChangeEn() {
	shippingEn.classList.remove("disactive_lang")
	shippingRu.classList.remove("active_lang")
	}



