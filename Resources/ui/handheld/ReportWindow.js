function ReportWindow(title) {
	Ti.App.dB.open();
	
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'black',
		backgroundImage:"images/background.png",
		layout:'vertical'
	});
	
	self.createLabel = function(text){
		return Ti.UI.createLabel({
			height:44,
			width:'auto',
			left:10,
			top:5,
			textAlign:Ti.UI.TEXT_ALIGNMENT_LEFT,
			text:text,
			color:'white'
		});
	};
	
	self.createTextField = function(text,hintText){
		return Ti.UI.createTextField({
			height:44,
			left:10,
			right:10,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			textAlign:Ti.UI.TEXT_ALIGNMENT_LEFT,
			value:text,
			hintText: hintText,
			clearButtonMode : Ti.UI.INPUT_BUTTONMODE_ONFOCUS
		});
	};
	
	self.createPicker = function(arrayData){
		var picker = Ti.UI.createPicker({
			left:10,
			right:10,
			type : Ti.UI.PICKER_TYPE_PLAIN
		});
		picker.setSelectedValue = function(value){
			picker.valor = value;
		}
		
		var data = [];
		for (var id in arrayData){
			data.push(Ti.UI.createPickerRow({title:arrayData[id]}));
		}
		picker.selectionIndicator = true;
		picker.add(data);
		picker.setSelectedValue(data[0].title);
		
		picker.addEventListener('change',function(e){
			picker.setSelectedValue(e.row.title);
		});
		return picker;
	};
	
	MenuView = require('ui/common/MenuView');
	var menuView = new MenuView(L('home'));
	self.add(menuView);
	
	var scrollable = Ti.UI.createScrollView({layout:'vertical'});
	self.add(scrollable);
	self.scrollable = scrollable;
	
	// codi provincia
	var labelProvincia = self.createLabel(L('provincia'));
	scrollable.add(labelProvincia);
	
	self.arrayProvincies = Ti.App.dB.getProvinces();
	var pickerProvincia = self.createPicker(self.arrayProvincies);
	scrollable.add(pickerProvincia);

	// codi poblacio
	var labelPoblacio = self.createLabel(L('poblacio'));
	scrollable.add(labelPoblacio);
	
	var textPoblacio = self.createTextField("","");
	//self.arrayInicialCities = Ti.App.dB.getCities(self.arrayProvincies[0]);
	//self.arrayCities = self.arrayInicialCities;
	//var pickerPoblacio = self.createPicker(self.arrayCities);
	scrollable.add(textPoblacio);	
	
	// colegi electoral
	var labelColegi = self.createLabel(L('collegi_electoral'));
	scrollable.add(labelColegi);
	var textColegi = self.createTextField("",L('exemple_carrer'));
	scrollable.add(textColegi);
	
	// partit afectat
	var labelPartit = self.createLabel(L('partit_afectat'));
	scrollable.add(labelPartit);
	
	// TODO: unharcode partits list
	self.arrayPartits = [
		"Convergència i Unió (CiU)",
		"Ciutadans - Ciudadanos (Cs)",
		"Candidatura d'Unitat Popular - Alternativa d'Esquerres (CUP)",
		"Escons en Blanc (EB)",
		"Esquerra Republicana de Catalunya - Catalunya Sí (ERC)",
		"Hartos.org (FARTS.CAT)",
		"Iniciativa per Catalunya Verds (ICV-EUiA)",
		"Partit Animalista Contra el Maltractament Animal (PACMA)",
		"Pirates de Catalunya (PIRATA.CAT)",
		"Partit Popular (PPC)",
		"Partit Republicà d'Esquerres - Izquierda Republicana (PRE-IR)",
		"Partit Socialista de Catalunya (PSC)",
		"Plataforma per Catalunya (PxC)",
		"Solidaritat Catalana (SI)",
		"Socialistes i Republicans - Pel dret a decidir (SiR)",
		"Unificación Comunista de España (UCE)",
		"Unión, Progreso y Democracia (UPyD)",
		"Vía Democrática (VD)"
	];
	var pickerPartit = self.createPicker(self.arrayPartits);
	scrollable.add(pickerPartit);
	
	// causa incidencia
	var labelCausa = self.createLabel(L('causa'));
	scrollable.add(labelCausa);
	
	// TODO: unhardcode causes list
	self.arrayCauses = [
		'Absència de paperetes',
		'Paperetes ocultes o no accessibles',
		'Persona condicionant el vot', 
		'Persona impedint l\'exercici del vot',
		'Altres'
	];
	var pickerCausa =self.createPicker(self.arrayCauses);
	scrollable.add(pickerCausa);
	
	var data1 = [];
	data1.push(Ti.UI.createPickerRow({title:"test"}));
	pickerCausa.add(data1);
	
	// reportador
	var labelReportador = self.createLabel(L('nom_del_reportador'));
	scrollable.add(labelReportador);
	var textReportador = self.createTextField("","");
	scrollable.add(textReportador);
	
	// telefon/email reportador
	var labelTelefon = self.createLabel(L('tel_reportador'));
	scrollable.add(labelTelefon);
	var textTelefon = self.createTextField("","");
	scrollable.add(textTelefon);
	
	// comentaris reportador
	var labelComentaris = self.createLabel(L('comentaris'));
	scrollable.add(labelComentaris);
	var textComentari = self.createTextField("","");
	scrollable.add(textComentari);
	
	var horizontalView = Ti.UI.createView({layout:"horizontal",height:55,bottom:10, top:10, right:10});
	scrollable.add(horizontalView);

	var buttonReport = Ti.UI.createButton({
		height:55,
		width:'100',
		title:L('enviar'),
		left:10
	});
	horizontalView.add(buttonReport);
	
	self.actInd = Ti.UI.createActivityIndicator({
		height:50,
		width:150,
		color:'white',
		message:L('enviant')
	});
	self.actInd.hide();
	horizontalView.add(self.actInd);
	
	self.coords = "unknown";
	buttonReport.addEventListener('click',function(){
		
		if (textPoblacio.value == "" || textColegi.value == "" || textReportador.value =="" || textTelefon.value == ""){
			var dialog = Ti.UI.createAlertDialog({
				message: L("error_validacio_report"),
				ok: 'Ok',
				title: 'Error'
			}).show();
		}else{
			self.actInd.show();
			buttonReport.enabled = false;
			
			var xhr = Titanium.Network.createHTTPClient();
			xhr.onload = function(){
				var list = JSON.parse(this.responseText);
				var message = list['message'];
				
				Ti.API.info('response is ',message);
				if (message == "OK"){
					var dialog = Ti.UI.createAlertDialog({message: L('report_enviat_ok'),ok: 'Ok',title: L('enviat_titol')}).show();
				}else{
					var dialog = Ti.UI.createAlertDialog({message: L(message),ok: 'Ok',title: 'Error'}).show();
				}
				self.actInd.hide();
				buttonReport.enabled = true;
			};
			xhr.onerror = function(e){
				Ti.API.info("ERROR " + e.error);
				var dialog = Ti.UI.createAlertDialog({message: L('send_report_error'),ok: 'Ok',title: 'Error'}).show();
				self.actInd.hide();
				buttonReport.enabled = true;
			};
			//var serverUrl = Titanium.App.Properties.getString('server_url')+ "test.php";
			var serverUrl = Titanium.App.Properties.getString('server_url')+ "inserir.php";
			xhr.open("POST",serverUrl);
			var dataToSend ={
				'partit_afectat':pickerPartit.valor, 
				'provincia':pickerProvincia.valor,
				'poblacio':textPoblacio.value,
				'coords':self.coords,
				'deviceid': Ti.Platform.id,
				'collegi_electoral':textColegi.value,
				'causa':pickerCausa.valor,
				'reportador':textReportador.value,
				'contacte_reportador':textTelefon.value,
				'comentari':textComentari.value
			}; 
			Ti.API.info('data to send',dataToSend);
			xhr.send(dataToSend);
		}
	});
	
	var buttonClear = Ti.UI.createButton({
		height:55,
		width:'100',
		title:L('reset'),
		left:10,
		//bottom:10
	});
	if (Titanium.Platform.name == 'iPhone OS'){
		scrollable.add(buttonClear);
	}else{
		horizontalView.add(buttonClear);
	}
	
	buttonClear.addEventListener('click',function(){
		textPoblacio.value = "";
		textColegi.value = "";
		textReportador.value ="";
		textTelefon.value = "";
		textComentari.value = "";
		pickerPartit.setSelectedRow(0,0);
		pickerPartit.setSelectedValue(self.arrayPartits[0]);
		pickerProvincia.setSelectedRow(0,0);
		pickerProvincia.setSelectedValue(self.arrayProvincies[0]);
		pickerCausa.setSelectedRow(0,0);
		pickerCausa.setSelectedValue(self.arrayCauses[0]);
	});

	self.addEventListener('focus',function(){
		if (Ti.Geolocation.locationServicesEnabled === true){
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.purpose =L('obtenir_posicio');

			Ti.Geolocation.getCurrentPosition(function(e){
				if (!e.success || e.error){
					Ti.API.debug('error ' + JSON.stringify(e.error));
					return;
				}
		
				var longitude = e.coords.longitude;
				var latitude = e.coords.latitude;
				var accuracy = e.coords.accuracy;
				
				self.coords = 'long{' + longitude.toFixed(6) + '},lat{' + latitude.toFixed(6) + "},accuracy{" + accuracy + "}";
				Ti.API.debug('geo - current location: long ' + longitude.toFixed(6) + ' lat ' + latitude.toFixed(6) + ' accuracy ' + accuracy);
	
			});
		}else{
			Ti.API.debug('locationServices not Enabled');
		}
	});
	
	return self;
};

module.exports = ReportWindow;
