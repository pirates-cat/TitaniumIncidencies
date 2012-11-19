function MenuView(activeView) {
	//create module instance
	var self =  Ti.UI.createView({backgroundColor: 'black', height:50,left:10,right:10,layout:'horizontal'});
	
	var buttonList = [
		{text : L('home'), onClickEvent:'showTab1'},
		//{text : L('search'), onClickEvent:'showTab2'},
		{text : L('about'), onClickEvent:'showTab3'}
	];
	for (var id in buttonList){
		
		var currentData = buttonList[id];
		//buttonWidth = buttonWidth.toFixed(0);
		//Ti.API.info("id is " + id + " title " + currentData.text);
		var menuButton = Ti.UI.createLabel({
			height:50,
			width:  "50%",
			text:currentData.text,
			textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER ,
			color:'white',
			onClickEvent :currentData.onClickEvent
		});
		menuButton.addEventListener('click',function(e){
			Ti.App.fireEvent(e.source.onClickEvent);
		});
		
		if (activeView == currentData.text){
			menuButton.backgroundColor =  '#555555';
		}else{
			menuButton.backgroundColor =  '#222222';
		}
		self.add(menuButton);
		
		
	}
	return self;
};

module.exports = MenuView;