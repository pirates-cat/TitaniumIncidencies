function ReportWindow(title) {
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
			visibleItems: 1,
			type : Ti.UI.PICKER_TYPE_PLAIN
		});
		
		var data = [];
		for (var id in arrayData){
			data.push(Ti.UI.createPickerRow({title:arrayData[id]}));
		}
		picker.selectionIndicator = true;
		picker.add(data);
		picker.valor = data[0].title;
		picker.addEventListener('change',function(e){
			picker.valor = e.row.title;
		});

		return picker;
	};
	
	var scrollable = Ti.UI.createScrollView({layout:'vertical'});
	self.add(scrollable);
	self.scrollable = scrollable;

	var buttonGetAddress = Ti.UI.createButton({
		height:55,
		left:10,
		right:10,
		top:10,
		title:L('obtenir_posicio_actual')
	});
	scrollable.add(buttonGetAddress);
	// codi provincia
	var labelProvincia = self.createLabel(L('provincia'));
	scrollable.add(labelProvincia);
	var textProvincia = self.createTextField("hh","");
	scrollable.add(textProvincia);

	// codi poblacio
	var labelPoblacio = self.createLabel(L('poblacio'));
	scrollable.add(labelPoblacio);
	var textPoblacio = self.createTextField("hh","");
	scrollable.add(textPoblacio);	
	
	// colegi electoral
	var labelColegi = self.createLabel(L('collegi_electoral'));
	scrollable.add(labelColegi);
	var textColegi = self.createTextField("h",L('exemple_carrer'));
	scrollable.add(textColegi);
	
	// partit afectat
	var labelPartit = self.createLabel(L('partit_afectat'));
	scrollable.add(labelPartit);
	
	// TODO: unharcode partits list
	var arrayPartits = ['PIRATA.CAT','Escons en blanc','CUP'];
	var pickerPartit = self.createPicker(arrayPartits);
	scrollable.add(pickerPartit);
	
	// causa incidencia
	var labelCausa = self.createLabel(L('causa'));
	scrollable.add(labelCausa);
	
	// TODO: unhardcode causes list
	var arrayCauses = ['Absència de paperetes','Paperetes ocultes o no accessibles','Persona condicionant el vot', 'Persona impedint l\'exercici del vot','Altres'];
	var pickerCausa =self.createPicker(arrayCauses);
	scrollable.add(pickerCausa);
	
	// reportador
	var labelReportador = self.createLabel(L('nom_del_reportador'));
	scrollable.add(labelReportador);
	var textReportador = self.createTextField("hh","");
	scrollable.add(textReportador);
	
	// telefon/email reportador
	var labelTelefon = self.createLabel(L('tel_reportador'));
	scrollable.add(labelTelefon);
	var textTelefon = self.createTextField("f","");
	scrollable.add(textTelefon);
	
	// comentaris reportador
	var labelComentaris = self.createLabel(L('comentaris'));
	scrollable.add(labelComentaris);
	var textComentari = self.createTextField("f","");
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
		
		if (textPoblacio.value == "" || textProvincia.value == "" || textColegi.value == "" || textReportador.value =="" || textTelefon.value == ""){
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
				'provincia':textProvincia.value,
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
		bottom:10
	});
	scrollable.add(buttonClear);
	
	buttonClear.addEventListener('click',function(){
		textProvincia.value = "";
		textPoblacio.value = "";
		textColegi.value = "";
		textReportador.value ="";
		textTelefon.value = "";
		textComentari.value = "";
	});
	
	self.addEventListener('focus',function(){
		Ti.API.info("focus!!");
	});
	buttonGetAddress.addEventListener('click',function(){
		if (Ti.Geolocation.locationServicesEnabled === true){
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.purpose =L('obtenir_posicio');
			//
			// GET CURRENT POSITION - THIS FIRES ONCE
			//
			Ti.Geolocation.getCurrentPosition(function(e){
				if (!e.success || e.error){
					currentLocation.text = 'error: ' + JSON.stringify(e.error);
					Ti.API.info("Code translation: "+translateErrorCode(e.code));
					alert('error ' + JSON.stringify(e.error));
					return;
				}
		
				var longitude = e.coords.longitude;
				var latitude = e.coords.latitude;
				var accuracy = e.coords.accuracy;
				
				self.coords = 'long{' + longitude.toFixed(6) + '},lat{' + latitude.toFixed(6) + "},accuracy{" + accuracy + "}";
				Ti.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
					if (evt.success) {
						var places = evt.places;
						if (places && places.length) {
							//reverseGeo.text = places[0].address;
							var firstPlace = places[0];
							//textProvincia.value = "";
							textPoblacio.value = firstPlace.city;
						} else {
							//reverseGeo.text = "No address found";
						}
						Ti.API.info("reverse geolocation result = "+JSON.stringify(evt));
						textComentari.value ="reverse geolocation result = "+JSON.stringify(evt);
					}
					else {
						Ti.UI.createAlertDialog({
							title:'Error',
							message:evt.error
						}).show();
						Ti.API.info("Code translation: "+translateErrorCode(e.code));
					}
				});	
		
				Ti.API.info('geo - current location: long ' + longitude.toFixed(6) + ' lat ' + latitude.toFixed(6) + ' accuracy ' + accuracy);
	
			});
		}else{
			Ti.API.info('locationServices not Enabled');
		}
	});
	buttonGetAddress.fireEvent('click');
	return self;
};

module.exports = ReportWindow;
