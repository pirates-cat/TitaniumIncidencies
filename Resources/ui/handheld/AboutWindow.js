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
		Ti.API.info('data to send',text);
	};
	
	self.createLine = function (view,texttitle,textdesc){
		//var view = Ti.UI.createView({layout:'horizontal',top:10,left:0,right:10,height:'50'});
		view.add(self.createLabel(texttitle,'white','12dp',10));
		view.add(self.createLabel(textdesc,'white','14dp',0));
		return view;
	}
	
	var scrollable = Ti.UI.createScrollView({layout:'vertical'});
	self.add(scrollable);
	self.scrollable = scrollable;
/*
author,author_name
special_thanks,special_thanks_to
license,license_type
sourcecode,sourcecode_url
*/
	self.createLine(scrollable,L('author'),L('author_name'));
	self.createLine(scrollable,L('special_thanks'),L('special_thanks_to'));
	self.createLine(scrollable,L('license'),L('license_type'));
	self.createLine(scrollable,L('sourcecode'),L('sourcecode_url'));
	
	return self;
};

module.exports = AboutWindow;
