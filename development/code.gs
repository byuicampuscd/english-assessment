
function pullDataFromDump(){
  var last = (parseInt(PropertiesService.getDocumentProperties().getProperty("last")) || 1);
  var dump = SpreadsheetApp.getActive().getSheetByName("dump");
  if(last >= dump.getLastRow()) return;
  var dataRange = dump.getRange(last+1, 1, (dump.getLastRow())-last, dump.getLastColumn());
  var data = (dataRange.getValues());
  last = dump.getLastRow();
  PropertiesService.getDocumentProperties().setProperty("last", last);
  var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
  lobby.getRange(lobby.getLastRow()+1, 1, data.length, data[0].length).setValues(data);
}

function resetIndex(){
  PropertiesService.getDocumentProperties().setProperty("last", 1);
}

function launchSideBar(){
  var html = HtmlService.createHtmlOutputFromFile("sidebar")
  .setTitle("Student Response Viewer")
  .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function onOpen(e){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Student Data")
  .addItem("Pull Student Data", 'pullDataFromDump')
  .addItem("Student Response Viewer", 'launchSideBar')
  .addItem("Send Feedback", 'launchEmail')
  .addToUi();
  launchSideBar();
}

function launchEmail(){
  var html = HtmlService.createHtmlOutputFromFile("email").setTitle("Send Responses").setWidth(800);
  SpreadsheetApp.getUi().showSidebar(html);
}

function sendAll(){
  Logger.log("Begin");
  var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
  var all = lobby.getRange(2, 1, lobby.getLastRow(), lobby.getLastColumn()).getValues();
  for(var i in all){
    if(all[i][10] == "" && all[i][8] != ""){
     MailApp.sendEmail(all[i][4], all[i][7] +" Response Feedback", all[i][8]);
     all[i][10] = "yes";
    }else{
     
    }
  }
  
  lobby.getRange(2, 1, lobby.getLastRow(), lobby.getLastColumn()).setValues(all);
  alert("Message Sucsessfuly Sent!");
}


function sortByParameter(day, courses, stud){

  
  var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
  var all = lobby.getRange(2, 1, lobby.getLastRow(), lobby.getLastColumn()).getValues();
  
  var c = (day != "") ? (day.indexOf(",") < 0) ? sortPropertybyRows(all, 8, day) : sortPropertybyRows(all,8,day.split(",")) : all;
  //Logger.log(c);
  Logger.log(day);
  if(courses){
    c = sortPropertybyRows(c, 4, courses.split(","),false);
    Logger.log("length");
    //Logger.log(c);
  }
  
  if(stud){
    c= sortPropertybyRows(c, 2, stud.split(","), true);
  }
  
  var response = SpreadsheetApp.getActive().getSheetByName("View Response");
  response.clearContents();
 
  response.getRange("A1:K1").setValues(lobby.getRange("A1:K1").getValues());
  response.getRange(2, 1,c.length,c[0].length).setValues(c);
  SpreadsheetApp.setActiveSheet(response);
  //Logger.log(c );
}

function alert(message){
  SpreadsheetApp.getUi().alert(message);
}

function sortPropertybyRows(all, property, value, name){
  var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
  var properties = [];

  for(var i in all){
    if(typeof value == "string"){
      if(all[i][property-1].toLowerCase() == value.toLowerCase()){
         properties.push(all[i]);
      }
    }else if(value.constructor === Array){
      if(name){
        Logger.log("NAME GAME!")
        for(var j in value){
          Logger.log(value[j]);
          var parts = value[j].trim().split(" ");
             if(all[i][property-1].toLowerCase().trim() == parts[0].toLowerCase().trim()){
               if(parts.length > 1){
                  if(all[i][property].toLowerCase().trim() == parts[1].toLowerCase().trim())
                    properties.push(all[i]);
                  else
                    Logger.log(all[i][property].toLowerCase().trim()+" is not "+parts[1].toLowerCase().trim())
               }else{
                  properties.push(all[i]);
               }
             }else{
               if(parts.length <= 1){
                 if(parts[0].toLowerCase().trim() == all[i][property].toLowerCase().trim()){
                    properties.push(all[i]);
                 }
               }
             }
          }
        }else{
          Logger.log("So this is how you want it?");
        for(var j in value){
          if(all[i][property-1].trim().toLowerCase() == value[j].trim().toLowerCase()){
               properties.push(all[i]);
          }
        }
      }
    }else{
      Logger.log("IMPOSTER!")
    }
    }

  //Logger.log(properties);
  return properties;
}

function setCan(day,data){
  Logger.log(data);
  if(day){
     var stringdata = JSON.stringify(data);
     stringdata.replace(/[=]/g,":");
     PropertiesService.getDocumentProperties().setProperty(day, stringdata);
  }
  
  var rep = SpreadsheetApp.getActive().getSheetByName("View Response");
  var values = rep.getRange(2, 1, rep.getLastRow()-1, rep.getLastColumn()).getValues();
  for(var i in values){
    if(values[i][9] == ""){
      }else{
      Logger.log("can"+(parseInt(i)+1));
        values[i][8] = (values[i][8] != "") ? values[i][8] +"\n"+data["can"+(values[i][9])] : data["can"+(values[i][9])];
        values[i][9] = "";
    }
  }
  
  rep.getRange(2, 1, rep.getLastRow()-1, rep.getLastColumn()).setValues(values);
  var lobby = SpreadsheetApp.getActive().getSheetByName("Lobby");
  var nd = lobby.getRange(2, 1, lobby.getLastRow()-1, lobby.getLastColumn()).getValues();
  
  Logger.log(nd)
  for(var i in values){
    for(var j in nd){
      if(values[i][0].toString() == nd[j][0].toString()){
        Logger.log("Changed");
        nd[j] = values[i];
        break;
      }else{
        Logger.log("\n"+values[i][0]+"\nis not \n"+nd[j][0]);
      }
    }
  }
;
  lobby.getRange(2, 1, lobby.getLastRow()-1, lobby.getLastColumn()).setValues(nd)
  
}
function getDataFromCol(col,name){
  var item = [];
  var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
  var data = lobby.getRange(2, col, lobby.getLastRow()-1, 2).getValues();
  for(var i in data){
    var current = data[i][0].trim();
    current += (name) ? " "+data[i][1].trim() :"";
    if(item.indexOf(current) < 0)
      item.push(current);
  }
  Logger.log(item);
  return item;
}


function getCan(day){
  var data = (PropertiesService.getDocumentProperties().getProperty(day) || {can1:"",can2:"",can3:"",can4:"",can5:""});
  Logger.log(data);
  return data;
}

function process(object){
  Logger.log(object.value,"I was Called!");
}

function runMe(){
  Logger.log("run");
}

function fail(){
  Logger.log("fail");
}
