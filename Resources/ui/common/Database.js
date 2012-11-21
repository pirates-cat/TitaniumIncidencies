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
		//CREATE TABLE "meses_electorals" ("COLLEGI_ELECTORAL" ,"ADRECA" ,"POBLACIO" ,"PROVINCIA" )
		//Ti.API.info("jhgjhgjhgjhg");
	};
	
	self.getProvinces = function (){
		if (self.db != null){
			var rows = self.db.execute('SELECT distinct PROVINCIA FROM meses_electorals order by PROVINCIA');			
			var provinces = [];
			while (rows.isValidRow()){
				provinces.push( rows.field(0));
				rows.next();
			}
			rows.close();
			return provinces;
		}
		return [];
	};
	
	self.getCities = function (province){
		if (self.db != null){
			var rows = self.db.execute("SELECT distinct POBLACIO FROM meses_electorals WHERE PROVINCIA = ? order by POBLACIO",province);
			Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
			
			var cities =[];
			while (rows.isValidRow()){
				cities.push(rows.field(0));
				rows.next();
			}
			rows.close();
			return cities;
		}
		return [];
	};
	
	self.getCollegis = function (city){
		if (self.db != null){
			var rows = self.db.execute("SELECT distinct COLLEGI_ELECTORAL FROM meses_electorals WHERE POBLACIO = ? order by COLLEGI_ELECTORAL",city);
			Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
			
			var collegis =[];
			while (rows.isValidRow()){
				collegis.push(rows.field(0));
				rows.next();
			}
			rows.close();
			return collegis;
		}
		return [];
	};
	
	self.close = function (){
		self.db.close();
	};
	return self;
};

module.exports = DataBase;