function DataBase() {
	//create module instance
	var self = {};
	
	self.open = function (){
		var dbIsInstalled = Ti.App.Properties.getBool('dbInstalled',false);
		if (dbIsInstalled == false){
			self.db = Ti.Database.install('/db/meses_electorals.sqlite', 'meses_electorals');
			Ti.App.Properties.setBool('dbInstalled',true);
			Ti.API.info("was not installed");
		}else{
			self.db = Ti.Database.open('meses_electorals');
			Ti.API.info("already installed");
		}
		Ti.API.info("jhgjhgjhgjhg");
	};
	
	self.getProvinces =function (){
		if (self.db != null){
			var rows = self.db.execute('SELECT distinct PROVINCIA FROM meses_electorals order by PROVINCIA');
			Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
			
			var provinces =[];
			while (rows.isValidRow())
			{
				provinces.push( rows.field(0));
				//Titanium.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('PROVINCIA'));
				rows.next();
			}
			rows.close();
			return provinces;
		}
		return [];
	};
	self.close = function (){
		self.db.close();
	};
	return self;
};

module.exports = DataBase;