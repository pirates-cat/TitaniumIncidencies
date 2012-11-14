function ApplicationTabGroup(ReportWindow, SearchWindow,AboutWindow) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//home : introduccio de dades
	var win1 = new ReportWindow(L('home'));
	win1.containingTab = Ti.UI.createTab({
		title: L('home'),
		
		window: win1
	});
	if (Titanium.Platform.name == 'iPhone OS'){
		win1.containingTab.icon= '/images/KS_nav_ui.png';
	}
	
	self.addTab(win1.containingTab);
	/*
	//tab2 : cerca de dades
	var win2 = new SearchWindow(L('search'));
	win2.containingTab = Ti.UI.createTab({
		title: L('search'),
		icon: '/images/ic_action_search.png',
		window: win2
	});
	self.addTab(win2.containingTab);
	*/
	//tab3 : about this app
	var win3 = new AboutWindow(L('about'));
	win3.containingTab = Ti.UI.createTab({
		title: L('about'),
		//icon: '/images/ic_action_search.png',
		window: win3
	});
	if (Titanium.Platform.name == 'iPhone OS'){
		win3.containingTab.icon= '/images/KS_nav_ui.png';
	}
	self.addTab(win3.containingTab);
	return self;
};

module.exports = ApplicationTabGroup;