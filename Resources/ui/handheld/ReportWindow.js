function ReportWindow(title) {
	Ti.App.dB.open();
	
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'black',
		backgroundImage:"images/background.png",
		layout:'vertical',
		orientationModes : []
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
	
	self.createPicker = function(arrayData,onChangeEvent,removeUppercase,selectText){
		
		var returnedView = Ti.UI.createView({height:'50'}); 
		returnedView.onChangeEvent=onChangeEvent;
		returnedView.setSelectedValue = function(value){
			//Ti.API.info("setting selected value to " +value);
			returnedView.valor = value;
		};
		
		returnedView.setSelectedRow = function(value1, value2){
			if (returnedView.picker != null){
				returnedView.picker.setSelectedRow(value1, value2);
			}
		};
		returnedView.ucFirstLowerRest = function (str) {
			  str += '';
			  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
		};
		returnedView.resetPicker = function(arrayData){
			if (returnedView.picker != null){
				returnedView.remove(returnedView.picker);
				returnedView.picker = null;
			}
			
			var picker = Ti.UI.createPicker({
				left:10,
				right:10,
				type:Ti.UI.PICKER_TYPE_PLAIN
			});
			returnedView.picker = picker;
			returnedView.add(picker);
			//returnedView.height = picker.height;
			// first will be a blank row
			var titleText ="";
			if (selectText!= null){
				titleText = selectText;
			}
			picker.add(Ti.UI.createPickerRow({title:titleText+ "                                                        ",valor:""}));
			var rowText = null;	
			var rowArray = [];
			for (var id in arrayData){
				if (removeUppercase != true){
					rowText = returnedView.ucFirstLowerRest(arrayData[id]);
				}else{
					rowText = arrayData[id];
				}
				 rowArray.push(Ti.UI.createPickerRow({
				 	
					title:rowText + "                                                        ", // nasty titanium bug which centers text in pickers
					valor:arrayData[id]
				}));
				
			}
			picker.add(rowArray);
			if (arrayData == []){
				Ti.API.debug("filling picker with  empty list");
			}else{
				Ti.API.debug("filling picker with  " +arrayData.length +" rows");
			}
			
			picker.selectionIndicator = true;
			returnedView.setSelectedValue("");
			
			picker.addEventListener('change',function(e){
				returnedView.setSelectedValue(e.row.valor);
				if (returnedView.onChangeEvent != null){
					Ti.App.fireEvent(returnedView.onChangeEvent);
				}
			});
			
		};
		returnedView.resetPicker(arrayData);
		return returnedView;
	};
	var stringRequired = " *"; // this will indicate the required fields
	var stringDropdown = L('dropdown_select'); // Select...
	MenuView = require('ui/common/MenuView');
	var menuView = new MenuView(L('home'));
	self.add(menuView);
	
	var scrollable = Ti.UI.createScrollView({layout:'vertical'});
	self.add(scrollable);
	self.scrollable = scrollable;
	
	// codi provincia
	var stringProvincia = L('provincia');
	scrollable.add(self.createLabel(stringProvincia + stringRequired));
	
	self.arrayProvincies = Ti.App.dB.getProvinces();
	var pickerProvincia = self.createPicker(self.arrayProvincies,"onProvinceChanged",null,stringDropdown + " "+ stringProvincia.toLowerCase() );
	scrollable.add(pickerProvincia);
	
	// codi poblacio
	var stringPoblacio = L('poblacio');
	scrollable.add(self.createLabel(stringPoblacio + stringRequired));
	
	self.arrayCities = [];
	var pickerPoblacio = self.createPicker(self.arrayCities,"onCityChanged",null,stringDropdown +" " + stringPoblacio.toLowerCase());
	scrollable.add(pickerPoblacio);	
	self.pickerPoblacio = pickerPoblacio;
	
	// colegi electoral
	var stringColegi = L('collegi_electoral');
	scrollable.add(self.createLabel(stringColegi + stringRequired));
	self.arrayCollegis = [];
	var pickerColegi = self.createPicker(self.arrayCollegis,null,null,stringDropdown + " " + stringColegi.toLowerCase());
	scrollable.add(pickerColegi);
	self.pickerColegi = pickerColegi;
	
	// partit afectat
	var stringPartit = L('partit_afectat');
	scrollable.add(self.createLabel(stringPartit + stringRequired));
	
	// TODO: unharcode partits list
	self.arrayPartits = [
		"Tots",
		"Candidatura d'Unitat Popular - Alternativa d'Esquerres (CUP)",
		"Ciutadans - Ciudadanos (Cs)",
		"Convergència i Unió (CiU)",
		"Escons en Blanc (EB)",
		"Esquerra Republicana de Catalunya - Catalunya Sí (ERC)",
		"Hartos.org (FARTS.CAT)",
		"Iniciativa per Catalunya Verds (ICV-EUiA)",
		"Partit Animalista Contra el Maltractament Animal (PACMA)",
		"Partit Popular (PPC)",
		"Partit Republicà d'Esquerres - Izquierda Republicana (PRE-IR)",
		"Partit Socialista de Catalunya (PSC)",
		"Pirates de Catalunya (PIRATA.CAT)",
		"Plataforma per Catalunya (PxC)",
		"Socialistes i Republicans - Pel dret a decidir (SiR)",
		"Solidaritat Catalana (SI)",
		"Unificación Comunista de España (UCE)",
		"Unión, Progreso y Democracia (UPyD)",
		"Vía Democrática (VD)"
	];
	var pickerPartit = self.createPicker(self.arrayPartits, null, true, stringDropdown + " " + stringPartit.toLowerCase());
	scrollable.add(pickerPartit);

	// causa incidencia
	var stringCausa = L('causa');
	scrollable.add(self.createLabel(stringCausa + stringRequired));
	
	// TODO: unhardcode and translate causes list
	self.arrayCauses = [
		'Absència de paperetes',
		'Paperetes ocultes o no accessibles',
		'Persona condicionant el vot', 
		'Persona impedint l\'exercici del vot',
		'Altres'
	];
	var pickerCausa = self.createPicker(self.arrayCauses,null, true, stringDropdown + " " + stringCausa.toLowerCase());
	scrollable.add(pickerCausa);
	
	// reportador
	var stringReportador = L('nom_del_reportador');
	scrollable.add(self.createLabel(stringReportador + stringRequired));
	var textReportador = self.createTextField(Ti.App.Properties.getString('reporter_name', ''),"");
	scrollable.add(textReportador);
	
	// telefon/email reportador
	var stringTelefon = L('tel_reportador');
	scrollable.add(self.createLabel(stringTelefon + stringRequired));
	var textTelefon = self.createTextField(Ti.App.Properties.getString('reporter_phone', ''),"");
	scrollable.add(textTelefon);
	
	// comentaris reportador
	scrollable.add(self.createLabel(L('comentaris')));
	var textComentari = self.createTextField("","");
	scrollable.add(textComentari);
	
	var horizontalView = Ti.UI.createView({layout:"horizontal",height:50,bottom:10, top:10, right:10});
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
	self.isFormInvalid = function (){
		return (
				pickerPartit.valor == "" || 
				pickerProvincia.valor == "" || 
				pickerPoblacio.valor == "" ||
				pickerColegi.valor == "" || 
				pickerCausa.valor == "" ||
				textReportador.value =="" || 
				textTelefon.value == ""
				);
	};
	
	buttonReport.addEventListener('click',function(){
		if (self.isFormInvalid()){
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
					pickerCausa.setSelectedRow(0,0);
					pickerCausa.setSelectedValue("");
					pickerColegi.setSelectedRow(0,0);
					pickerColegi.setSelectedValue("");
					pickerPartit.setSelectedRow(0,0);
					pickerPartit.setSelectedValue("");
				}else{
					var dialog = Ti.UI.createAlertDialog({message: L(message),ok: 'Ok',title: 'Error'}).show();
				}
				self.actInd.hide();
				buttonReport.enabled = true;
				
				Ti.App.Properties.setString('reporter_name', textReportador.value);
				Ti.App.Properties.setString('reporter_phone', textTelefon.value);
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
				'poblacio':pickerPoblacio.valor,
				'coords':self.coords,
				'deviceid': Ti.Platform.id,
				'collegi_electoral':pickerColegi.valor,
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
		textReportador.value ="";
		textTelefon.value = "";
		textComentari.value = "";
		pickerPartit.setSelectedRow(0,0);
		pickerPartit.setSelectedValue("");
		pickerProvincia.setSelectedRow(0,0);
		pickerProvincia.setSelectedValue("");
		Ti.App.fireEvent('onProvinceChanged');
		pickerCausa.setSelectedRow(0,0);
		pickerCausa.setSelectedValue("");
		Ti.App.Properties.setString('reporter_name', '');
		Ti.App.Properties.setString('reporter_phone', '');
	});

	self.addEventListener('focus',function(){
		if (Ti.Geolocation.locationServicesEnabled === true){
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.purpose = L('obtenir_posicio');

			Ti.Geolocation.getCurrentPosition(function(e){
				if (!e.success || e.error){
					//Ti.API.debug('error ' + JSON.stringify(e.error));
					return;
				}
		
				var longitude = e.coords.longitude;
				var latitude = e.coords.latitude;
				var accuracy = e.coords.accuracy;
				
				self.coords = 'long:' + longitude.toFixed(6) + ',lat:' + latitude.toFixed(6) + ",accuracy:" + accuracy.toFixed(0);
				//Ti.API.debug('geo - current location: long ' + longitude.toFixed(6) + ' lat ' + latitude.toFixed(6) + ' accuracy ' + accuracy);
	
			});
		}else{
			//Ti.API.debug('locationServices not Enabled');
		}
	});
	
	Ti.App.addEventListener('onProvinceChanged',function(){
		if (pickerProvincia.valor != ""){
			self.arrayCities = Ti.App.dB.getCities(pickerProvincia.valor);
		}else{
			self.arrayCities = [];
		}
		
		pickerPoblacio.resetPicker(self.arrayCities);
		// collegis electorals should also be updated
		Ti.App.fireEvent('onCityChanged');
	});
	
	Ti.App.addEventListener('onCityChanged',function(){
		if (pickerPoblacio.valor != ""){
			self.arrayCollegis = Ti.App.dB.getCollegis(pickerPoblacio.valor);
		}else{
			self.arrayCollegis = [];
		}
		pickerColegi.resetPicker(self.arrayCollegis);
	});
	
	return self;
};

module.exports = ReportWindow;
