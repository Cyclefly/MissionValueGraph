// ==UserScript==
// @name         MissionValueGraph
// @version      0.8.4
// @author       Cyclefly
// @include      *://www.leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/missions/*
// @grant        none
// @updateURL    https://github.com/Cyclefly/MissionValueGraph/raw/main/MissionValueGraph.user.js
// ==/UserScript==

//Hier die erwartete Einsatzdauer einsetzen.
let missionDuration = 0;

//On the mainpaige
if ("/" == window.location.pathname){
	let momentScript = document.createElement("script"); momentScript.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"; document.head.append(momentScript);
	let chartScript = document.createElement("script");	chartScript.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js";	document.head.append(chartScript);
	
	const CreditValueContainer = document.createElement('li'); CreditValueContainer.id = "CreditValueContainer"; CreditValueContainer.style= "display:table;"; CreditValueContainer.setAttribute("onmouseover","this.childNodes.forEach(elem =>{elem.style.color='black'});"); CreditValueContainer.setAttribute("onmouseout","this.childNodes.forEach(elem =>{elem.style.color='white'});");
	const CreditValueInfo1 = document.createElement('a'); CreditValueInfo1.innerHTML = "Missionswert:&nbsp"; CreditValueInfo1.style="color: white; vertical-align: middle; height: 50px; display: table-cell; padding-left: 6px; padding-right: 0px;"; CreditValueInfo1.id = "CreditValueInfo1"; CreditValueInfo1.href="#";
	const CreditValueInfo2 = document.createElement('a'); CreditValueInfo2.innerHTML = "...<br>..."; CreditValueInfo2.style="color: white; vertical-align: middle; text-align: right; height: 50px; display: table-cell; padding-top:6px; padding-bottom:5px; padding-left: 0px;"; CreditValueInfo2.id = "CreditValueInfo2"; CreditValueInfo2.href="#";

	CreditValueContainer.appendChild(CreditValueInfo1);
	CreditValueContainer.appendChild(CreditValueInfo2);
	document.getElementById("navigation_top").parentNode.after(CreditValueContainer);

	// function showLightframe(content){let e=parseInt($("#lightbox_background").css("width")),i=parseInt($("#lightbox_background").css("height")),n=i-100;if(592>n){n=i-30;}let s=e-70;if(862>s){s=e-0;}let o=s-2,a=n-34,r=(e-s)/2;$("#lightbox_box").css("width",s+"px").css("height",n+"px").show();$("#lightbox_box").append('<divclass="lightbox_iframe"style="width:'+o+"px;height:"+a+'px"id="lightbox_iframe_'+iframe_lightbox_number+'"><divid="iframe-inside-container">'+content+'</div></div>');$("#lightbox_background").show();$("#lightbox_box").css("left",r+"px");$("#lightbox_box").css("top",(i-n)/2+"px");$("#lightbox_iframe_"+iframe_lightbox_number+"#iframe-inside-container").css("height",a).css("width",o);setTimeout(function(){$("#lightbox_iframe_"+iframe_lightbox_number).show().focus();},100);return{width:s,height:n};}

	function showLightframe(content){ let e = parseInt($("#lightbox_background").css("width"));let i = parseInt($("#lightbox_background").css("height"));	let	n = i - 100; if (592 > n) {n = i - 30;}let s = e - 70;if (862 > s){s = e - 0;}; let o = s - 2; let a = n - 34;let r = (e - s) / 2; $("#lightbox_box").css("width", s + "px").css("height", n + "px").show(); $("#lightbox_box").append('<div class="lightbox_iframe" style="width:' + o + "px;height:" + a + 'px" id="lightbox_iframe_' + iframe_lightbox_number + '"><div id="iframe-inside-container">' + content + '</div></div>'); $("#lightbox_background").show(); $("#lightbox_box").css("left", r + "px");	$("#lightbox_box").css("top", (i - n) / 2 + "px"); $("#lightbox_iframe_" + iframe_lightbox_number + " #iframe-inside-container").css("height", a).css("width", o); setTimeout(function () {$("#lightbox_iframe_" + iframe_lightbox_number).show().focus();}, 100); return {width: s , height: n}; }

	const asyncFun = async () => {
		//Get missionCatalogue from sessionStorage or fetch and parse	
		let missionCatalogue = {}; if(sessionStorage.getItem("missionCatalogue")){ missionCatalogue = JSON.parse(sessionStorage.getItem("missionCatalogue"));}else{ const response = await fetch('https://www.leitstellenspiel.de/einsaetze.json'); json = await response.json(); json.forEach(elem =>{	missionCatalogue[elem.id] = {Credits: elem.average_credits}; }); sessionStorage.setItem("missionCatalogue", JSON.stringify(missionCatalogue));}
		
		let userMissionIDs = new Array();
		function calcMissionValue(){
			userMissionIDs = new Array();
			//Create NodeList with every mission not yet finished/deleted
			let missions = document.querySelectorAll('div.missionSideBarEntry:not(.mission_deleted):not(.mission_alliance_distance_hide):not(#mission_sidebar_downtime_alert)'); //#mission_list > div.
			let totalCredits = 0; let userCredits = 0;
			for(let i=0;i<missions.length;i++){
				let mType = missions[i].getAttribute("mission_type_id")
				if(mType != "null"){ //not "null" (string) ,e.g. VGE
					//Check presence
					let userIcon = missions[i].querySelector("span.glyphicon:not(.hidden)").className.includes("user");
					if(userIcon){
						userCredits += +missionCatalogue[mType].Credits; // + to avoid "0" strings
					userMissionIDs.push({mID: +missions[i].getAttribute("mission_id"), mTypeID: mType});
					};
					totalCredits += +missionCatalogue[mType].Credits;
				};
			};
			CreditValueInfo2.innerHTML = userCredits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+"<br>"+totalCredits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		};
		calcMissionValue();
		window.setInterval(function(){ calcMissionValue(); }, 5000);
	
		function plotMissionValue(frameDims){
			let plotGraph = document.createElement("canvas"); plotGraph.id = "plotGraph"
			let plotGraphContainer = document.createElement("div"); plotGraphContainer.class="chart-container"; plotGraphContainer.style="position: relative; height:"+(frameDims.height-36)+"px; width:"+(frameDims.width-36)+"px"; document.getElementById("lightbox_graph").appendChild(plotGraphContainer).appendChild(plotGraph);
			let ctx = plotGraph.getContext('2d');	
			
			let missionStorage = JSON.parse(localStorage.getItem("missionStorage"));
			if(missionStorage){
				//Cutoff all missions too old to still exist
				let cutoffHours = 48; //Not equal missionDuration as missions can still be open
				let threshold = Date.now()-cutoffHours*60*60*1000; let changed = false;
				for(elem in missionStorage){if(Date.parse(missionStorage[elem].t)<threshold){delete missionStorage[elem];changed = true;}else{break;}};		
				if(changed){localStorage.setItem("missionStorage", JSON.stringify(missionStorage));console.log("shortened missionStorage")};

				//Create array with entries both in missionIDs list, being served by the user and the missionStorage. Parse date as date
				let userData = new Array();
				userMissionIDs.forEach(elem =>{
					if(missionStorage[elem.mID]){//Mission with user participation , in missionStorage
						if(missionStorage[elem.mID].hasOwnProperty("tPlanned")){ //if mission is marked as planned, set flag to keep the time
							if(missionDuration!=0){ //use time of accomplishment
								userData.push({t: new Date(missionStorage[elem.mID].tPlanned), y: missionCatalogue[elem.mTypeID].Credits, tPlanned: true });							
							}else{ //use time of creation
								userData.push({t: new Date(missionStorage[elem.mID].t), y: missionCatalogue[elem.mTypeID].Credits, tPlanned: true });							
							}
							// console.log("Planned mission finishes at ~ ",new Date(missionStorage[elem.mID].t))
						}else{
							userData.push({t: new Date(missionStorage[elem.mID].t), y: missionCatalogue[elem.mTypeID].Credits });					
						}
					}else{console.log("https://www.leitstellenspiel.de/missions/"+elem.mID," not in missionStorage, open mission to append");}//Mission with user participation , in missionStorage
				});	
				
				if(userData.length>0){
					//Calculate estimated time of accomplishment instead of creation
					userData.forEach(elem =>{if(!elem.tPlanned){elem.t = new Date((Date.parse(elem.t)+missionDuration*60*60*1000))}});

					//Sort Data by time, ascending
					function compare(a,b){let timeA=a.t;let timeB=b.t;let comparison=0;if(timeA>timeB){comparison=1;}else if(timeA<timeB){comparison=-1;}return comparison;}
					userData.sort(compare);		

					//Create second dataset including total Credits
					let currentCredits = +document.getElementById("navigation_top").innerText.replace("Credits: ","").replaceAll(".","");
					let userData2 = JSON.parse(JSON.stringify(userData)); //Deep copy, Date can no be reencoded as Date though
					userData2.forEach(elem =>{elem.t=new Date(elem.t)}); userData2[0].y += currentCredits;

					//Integration of credits
					for(let i=1;i<userData.length;i++){userData[i].y+=userData[i-1].y}; for(let i=1;i<userData2.length;i++){userData2[i].y+=userData2[i-1].y}; 
						
					//Calculate value of missions that should have been finished by now and will be cut of
					if(Date.parse(userData[0].t) > Date.now()){ //if first time entry is in the future, add current time entry
						let currentTime = {t: new Date(Date.now()), y:0}; userData.unshift(currentTime);
						let currentTime2 = {t: new Date(Date.now()), y:currentCredits}; userData2.unshift(currentTime2);
					}

					//Delete entries sharing the same time, keeping only the newest, with highest Value -> accumulated value
					for(let i= userData.length-2;i>=0;i--){if(userData[i].t.getTime()===userData[i+1].t.getTime()){userData.splice(i,1)}};
					for(let i= userData2.length-2;i>=0;i--){if(userData2[i].t.getTime()===userData2[i+1].t.getTime()){userData2.splice(i,1)}};	

					if(userData.length>=3){ //otherwise error with ticks
						 let cfg = { 
							 data: { datasets: [{ label: 'Jetzt', backgroundColor: 'rgba(255, 99, 132, 0.5)', borderColor: 'rgba(255, 99, 132)', data: [{t:Date.now(),y: 0}], type: 'line', pointRadius: 0, },{ label: 'Missionswert', backgroundColor: 'rgba(52, 152, 219, 0.5)', borderColor: 'rgba(52, 152, 219)', data: userData, type: 'line', pointRadius: 0, fill: false, lineTension: 0, borderWidth: 2 },{ label: 'Credits gesamt', backgroundColor: 'rgba(38, 230, 0, 0.5)', borderColor: 'rgba(38, 230, 0)', data: userData2, type: 'line', pointRadius: 0, fill: false, lineTension: 0, borderWidth: 2 }] },
							 options: { maintainAspectRatio: false, animation: { duration: 0 }, legend: { labels: { filter: function(item, chart) { return !item.text.includes('Jetzt'); } } }, scales: { xAxes: [{ type: 'time', time: { unit: 'hour', tooltipFormat: 'D.MMM k:mm [Uhr]', displayFormats:{ 'hour': 'k [Uhr]', }  }, distribution: 'linear', offset: false, ticks: { major: { enabled: false, fontStyle: 'bold' }, labelOffset: 0, source: 'auto', autoSkip: true, autoSkipPadding: 75, maxRotation: 0 }, afterBuildTicks: function(scale, ticks) { let majorUnit = scale._majorUnit; let firstTick = ticks[0]; let i, ilen, val, tick, currMajor, lastMajor;  val = moment(ticks[0].value); lastMajor = val.get(majorUnit);  for (i = 1, ilen = ticks.length; i < ilen; i++) { tick = ticks[i]; val = moment(tick.value); currMajor = val.get(majorUnit); tick.major = currMajor !== lastMajor; lastMajor = currMajor; } return ticks; } }], yAxes: [{ gridLines: { drawBorder: false }, scaleLabel: { display: true, labelString: 'Credits' }, ticks: { beginAtZero: true, callback: function(value, index, values) { if(parseInt(value) >= 1000){ return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); } else { return value; } } } }] }, tooltips: { intersect: false, mode: 'index', callbacks: { label: function(tooltipItem, myData) { let label = myData.datasets[tooltipItem.datasetIndex].label || ''; if (label && label != "Jetzt") {label += ": "+parseFloat(tooltipItem.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" C"; return label;  }else{ return '';  } } } } },
						 };
						if(!Chart.plugins.getAll().some(el => el.id === 'drawVerticalLine')){
							Chart.plugins.register({id: "drawVerticalLine",	afterDatasetsDraw: function (myChart, easing) {	const lineLeftOffset = myChart.getDatasetMeta(0).data[0]._model.x; const scale = myChart.scales['y-axis-0']; const context = myChart.chart.ctx; context.beginPath(); context.strokeStyle = '#ff0000'; context.moveTo(lineLeftOffset, scale.top); context.lineTo(lineLeftOffset, scale.bottom); context.stroke();}});
						}
						let myChart = new Chart(ctx, cfg);
					}else{console.log("not enough common missions in missionStorage and missionIDs"); $("#lightbox_graph").html('<p>Zu wenig Daten zum plotten. Nicht genug Einsätze angefahren oder in diesem Browser aufgerufen. Öffne mindestens 3 Alarmierungsfenster, angefahrener Einsätze.</p>');}
				}else{console.log("no data to plot, there may be no matching entries in MissionStorage and userMissionIDs"); $("#lightbox_graph").html('<p>Zu wenig Daten zum plotten. Nicht genug Einsätze angefahren oder in diesem Browser aufgerufen. Öffne mindestens 3 Alarmierungsfenster, angefahrener Einsätze.</p>');}
			}else{console.log("no missionStorage object");$("#lightbox_graph").html('<p>Kein missionStorage: Öffne erst ein paar angefahrene Einsätze im Browser.</p>');}
		}
		$('#CreditValueContainer').click(function(){$("#lightbox_graph").remove(); var frameDims = showLightframe('<div id="lightbox_graph" class="container-fluid"></div>'); plotMissionValue(frameDims);});
	}
	asyncFun();
}

	
//On missionpages
if (window.location.pathname.indexOf("missions/") > -1){
	function appendToStorage(name, mID, data){let old = JSON.parse(localStorage.getItem(name));if(old === null){old = {};old[mID]=data;localStorage.setItem(name, JSON.stringify(old));}else if(old[mID]===undefined){old[mID]=data;localStorage.setItem(name, JSON.stringify(old));};}
	function parseMissionDate(dateString){let matches=dateString.match(RegExp("([0-9]{2})\\. (.*), ([0-9]{2}):([0-9]{2})","i"));let day=matches[1];let month=matches[2];let hour=matches[3];let minute=matches[4];month=['Januar','Februar','MÃ¤rz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember',].indexOf(month);let today=new Date();let year=today.getFullYear();let date=new Date(year,month,day,hour,minute,0,0);if(today.getTime()-date.getTime()<0){date.setFullYear(date.getFullYear()-1);};return date;}

	let idString = $("#mission_help").length>0?document.getElementById("mission_help").href.replace("https://www.leitstellenspiel.de/einsaetze/",""):null;
	if(idString!==null){//VGE ausschließen
		let dateString = $('#missionH1').length>0?$('#missionH1').data('original-title'):null;
		if(dateString===null|| dateString ==="null"){alert("null")};
		let tCreated = parseMissionDate(dateString);
		let missionID = +idString.split("=").pop();

		//Add tRemaining key value if planned mission
		let data = null;
		if(!document.querySelector("#col_left > span[id^='mission_countdown_']")){//no planned mission
			data = {t: tCreated};	
		}else{//planned mission
			// let actualCredits = +document.getElementById("col_left").innerHTML.split("Verdienst: ")[1].split("&nbsp;Credits")[0].replace(".",""); let missionID = document.getElementById("mission_help").href.replace("https://www.leitstellenspiel.de/einsaetze/","").split("=").pop(); let tRemaining = null;
			if(document.getElementById("mission_countdown_"+missionID+"_projected")){//Mission already started
				let ttt = document.getElementById("mission_countdown_"+missionID+"_projected").innerHTML.split(":"); if(ttt.length===3){ tRemaining = (ttt[0]*3600+ttt[1]*60+ttt[2]*1)*1000; }else if(ttt.length===2){ tRemaining = (ttt[0]*60+ttt[1]*1)*1000; }else{ tRemaining = (ttt[0]*1)*1000; }
			}else{//Mission is yet to start
				let ttt = document.getElementById("mission_countdown_"+missionID).innerHTML.split(":");	if(ttt.length===3){	tRemaining = (ttt[0]*3600+ttt[1]*60+ttt[2]*1)*1000;}else if(ttt.length===2){tRemaining = (ttt[0]*60+ttt[1]*1)*1000;}else{tRemaining = (ttt[0]*1)*1000;}let dur = document.getElementById("col_left").innerHTML.split("Dauer: ")[1].split("<br>").shift().split(" ");if(dur[1].includes("Stunde")){tRemaining += +dur[0]*3600000;}else{tRemaining += +dur[0]*60000;}
			}			
			data = {t: tCreated , tPlanned: new Date(Date.now()+tRemaining)}; //actualCredits: actualCredits
		}
		appendToStorage("missionStorage",missionID,data)
	}
};
