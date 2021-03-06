app.provider("styleSwitcher", function() {
	function getParameterByName(name) {
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
		var results = regex.exec(window.location.href);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	return {
		framework: getParameterByName('framework'),
		$get: function () {
			return getParameterByName('framework');
		}
	};			 
});	