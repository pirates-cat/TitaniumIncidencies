// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	Ti.App.Properties.setString('server_url', 'http://192.168.1.55:8888/incidencies/');
	
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	/*
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	}
	else {
		*/
		ReportWindow = require('ui/handheld/ReportWindow');
		SearchWindow = require('ui/handheld/SearchWindow');
		AboutWindow = require('ui/handheld/AboutWindow');
	//}
	
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(ReportWindow, SearchWindow,AboutWindow).open();
})();
