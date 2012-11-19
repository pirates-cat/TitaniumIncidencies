function AboutWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'black',
		backgroundImage:"images/background.png",
		layout:'vertical'
	});
	
	self.createLabel = function(text,color, size,marginTop){
		return Ti.UI.createLabel({
			height:'auto',
			width:'auto',
			left:10,
			textAlign:Ti.UI.TEXT_ALIGNMENT_LEFT,
			text:text,
			color:color,
			top:marginTop,
			font: {fontSize:size}
		});
	};
	
	self.createLine = function (view,texttitle,textdesc,link){
		view.add(self.createLabel(texttitle,'#DDDDDD','12dp',10));
		var descLabel = self.createLabel(textdesc,'white','14dp',0);
		if(link == true && Titanium.Platform.name != 'iPhone OS'){
			descLabel.autoLink = Ti.UI.Android.LINKIFY_WEB_URLS;
		}
		view.add(descLabel);
		return view;
	}
	
	MenuView = require('ui/common/MenuView');
	var menuView = new MenuView(L('about'));
	self.add(menuView);
	
	var scrollable = Ti.UI.createScrollView({layout:'vertical'});
	self.add(scrollable);
	self.scrollable = scrollable;

	self.createLine(scrollable,L('author'),L('author_name'));
	self.createLine(scrollable,L('special_thanks'),L('special_thanks_to'));
	self.createLine(scrollable,L('license'),L('license_type'));
	self.createLine(scrollable,L('sourcecode'),L('sourcecode_url'),true);
	
	return self;
};

module.exports = AboutWindow;
