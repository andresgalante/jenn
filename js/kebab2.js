const appMenuItems=document.querySelectorAll('#appmenu > li')
const subMenuItems=document.querySelectorAll('#appmenu .menu > li')
Array.prototype.forEach.call(appMenuItems, function(el, i){
		if (0 == i) {
			el.setAttribute('tabindex', '0');
			el.addEventListener("focus", function() {
				currentIndex = 0;
			});
		} else {
			el.setAttribute('tabindex', '-1');
		}
});

Array.prototype.forEach.call(subMenuItems, function(el, i){
	el.setAttribute('tabindex', '-1');
});
