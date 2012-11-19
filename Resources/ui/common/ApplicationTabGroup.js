function ApplicationTabGroup(ReportWindow, SearchWindow,AboutWindow) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//home : introduccio de dades
	var win1 = new ReportWindow(L('home'));
	win1.containingTab = Ti.UI.createTab({
		title: L('home'),
		window: win1
	});
	self.addTab(win1.containingTab);
	/* TODO: implement ASAP
	//tab2 : cerca de dades
	var win2 = new SearchWindow(L('search'));
	win2.containingTab = Ti.UI.createTab({
		title: L('search'),
		window: win2
	});
	
	self.addTab(win2.containingTab);
	*/
	//tab3 : about this app
	var win3 = new AboutWindow(L('about'));
	win3.containingTab = Ti.UI.createTab({
		title: L('about'),
		window: win3
	});
	
	self.addTab(win3.containingTab);
	if (Titanium.Platform.name == 'iPhone OS'){
		win1.hideNavBar();
		//win2.hideNavBar();
		win3.hideNavBar();
		self.bottom=-50;
	}else{
		//tab is hiddend using -> http://developer.appcelerator.com/question/109971/how-to-hide-tabgroup-or-tabbar-in-android#answer-240922
		self.addEventListener("open", function(){ self.animate({top:-65,duration:0});});
	}
	//self.hide();
	
	Ti.App.addEventListener('showTab1',function(){
		
			self.setActiveTab(0);
		
	});
	/*
	Ti.App.addEventListener('showTab2',function(){
		if (Titanium.Platform.name == 'iPhone OS'){
			self.setActiveTab(2);
		}else{
			self.setActiveTab(1);
		}
	});
	*/
	Ti.App.addEventListener('showTab3',function(){
			self.setActiveTab(1);
	});

	return self;
};

module.exports = ApplicationTabGroup;