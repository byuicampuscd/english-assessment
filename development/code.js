/* global
PropertiesService
SpreadsheetApp
Logger
HtmlService
MailApp
*/

/* exported
pullDataFromDump
runTest
resetIndex
launchSideBar
onOpen
sendAll
sortByParameter
sortPropertybyRows
alert
fillVariables
setCan
getDataFromCol
getCan
process
getAverageRank
runMe
fail
*/
/**
 * Takes the raw form input and converts it into the grading format
 */
function pullDataFromDump() {
    //finds the last row that we pulled data from.
    //this data is stored into the application storage
    var last = parseInt(PropertiesService.getDocumentProperties().getProperty("last"), 10) || 1;
    //grabs the "dump" spreadsheet
    var dump = SpreadsheetApp.getActive().getSheetByName("dump");

    // don't do anything if there is no new student data
    if (last >= dump.getLastRow()) return;

    // the  spreadsheet with all the student grade data
    var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
    // the question being asked by the teacher
    var question = dump.getRange("G1").getValue();
    //makes sure the question in the spreadsheet heading matches the spreadsheet in the form
    lobby.getRange("G1").setValue(question);

    //takes the new data and then moves it to the lobby
    var dataRange = dump.getRange(last + 1, 1, dump.getLastRow() - last, dump.getLastColumn());
    var data = dataRange.getValues();
    lobby.getRange(lobby.getLastRow() + 1, 1, data.length, data[0].length).setValues(data);

    //saves last row into the application storage
    last = dump.getLastRow();
    PropertiesService.getDocumentProperties().setProperty("last", last);

    // opens/refreshes the selection sidebar once all the data has been grabbed.
    launchSideBar();
}

/**
 * Debugging changes in the global library
 */
function runTest() {
    Logger.log("This is the newest test");
}

/**
 * Changes last index back to 1
 */
function resetIndex() {
    PropertiesService.getDocumentProperties().setProperty("last", 1);
}

/**
 * Shows the search bar
 */
function launchSideBar() {
    var html = HtmlService.createHtmlOutputFromFile("sidebar")
        .setTitle("Student Response Viewer")
        .setWidth(300);
    SpreadsheetApp.getUi().showSidebar(html);
}


/**
 * Creates the options menu when the application is opened and then opens/refreshes the sidebar.
 */
function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Student Data")
        .addItem("Pull Student Data", 'pullDataFromDump')
        .addItem("Student Response Viewer", 'launchSideBar')
        .addItem("Send Feedback", 'sendAll')
        .addToUi();
    launchSideBar();
}

/**
 *  Finds all new responses and sends them to each stu
 */
function sendAll() {
    // the question that the students responded to. This data should be in the spreadsheet now.
    var question = "What is the most important thing that happened today in this class and what did you learn from it?";
    Logger.log("Begin");
    var ui = SpreadsheetApp.getUi();
    // confirms that they want to sendout the responses
    var result = ui.alert("Send All Responses", "Do you want to send all new student responses?", ui.ButtonSet.YES_NO);
    // abort if they say no
    if (result == ui.Button.NO) return;
    // gets the lobby speadsheet
    var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
    //gets the datarange
    var all = lobby.getRange(2, 1, lobby.getLastRow(), lobby.getLastColumn()).getValues();
    // were any new responses found?
    var found = false;
    // amount of new responses found
    var amount = 0;
    for (var i in all) {
        // checks for the sent flag on the response and also makes sure the response is not empty
        if (all[i][10] == "" && all[i][8] != "") {
            // sets up the email to the student
            var email = {
                to: all[i][5],
                subject: all[i][3] + ": " + all[i][4] + " Response Feedback",
                htmlBody: "<h3>Question:</h3>" + question + "<br><br><h3>Your Response:</h3>" + all[i][6] + "<br><br><h3>Teacher's Response:</h3>" + all[i][8]
            };
                //sends the email to the student
            MailApp.sendEmail(email);
            //flags email as sent
            all[i][10] = "yes";
            // a message was sent
            found = true;
            // adds to tally of messages sent
            amount++;
            //updates the lobby data with the flags
            lobby.getRange(2, 1, lobby.getLastRow(), lobby.getLastColumn()).setValues(all);
        } else {
            // email not sent
        }
    }
    // alerts the user that it could not find any new responses
    if (!found)
        alert("There were no new responses to send.");
    else
    //alerts the user that messages were sent
        alert(amount == 1 ? "Your message has been sent!" : "Your messages have been sent");
    //updates lobby data to reflect the changes in flags
    lobby.getRange(2, 1, lobby.getLastRow(), lobby.getLastColumn()).setValues(all);

}

/**
 * Returns lobby data that matches all of the provided criteria
 *   @param {string} day - Filters resonses for specified day(s). Multiple day filters are applied when the string contains multiple days separated by commas. Ex: "Day 1,Day 2,Day 3"
 *   @param {string} courses - Filters resonses for the specified class(es). Multiple class filters are applied when the string contains multiple classes separated by commas. Ex: "SAN 101,TST 210,PLY 315"
 *   @param {string} stud - Filters resonses for the specified student(s). Multiple student filters are applied when the string contains multiple names separated by commas. Ex: "John Doe , Derek Zoolander, Paul Rice" If a full name is specified, it will filter each result by the full name. If only one name if provided, it will filter results that contain the specified name. Ex: the fiter "Zoolander" would accept the names: Derek Zoolander, Zoolander, Zoolander Derek
 */
function sortByParameter(day, courses, stud) {

    //defines the lobby spreadsheet
    var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
    //gets the value array
    var all = lobby.getRange(2, 1, lobby.getLastRow(), lobby.getLastColumn()).getValues();

    //filters data by the day(s) specified. If no day is specified, all data is passed through.
    var c = day != "" ? day.indexOf(",") < 0 ? sortPropertybyRows(all, 5, day) : sortPropertybyRows(all, 5, day.split(",")) : all;


    if (courses) {
        //filters data by the courses that were specified
        c = sortPropertybyRows(c, 4, courses.split(","), false);
    }

    if (stud) {
        //filters data by the specified students
        c = sortPropertybyRows(c, 2, stud.split(","), true);
    }

    // grabs the student response spreadsheet
    var response = SpreadsheetApp.getActive().getSheetByName("View Response");

    // empties response spreadsheet
    response.clearContents();
    //sets the headers
    response.getRange("A1:L1").setValues(lobby.getRange("A1:L1").getValues());
    //fills in the filtered data
    response.getRange(2, 1, c.length, c[0].length).setValues(c);

    //trims the extra collumns and rows
    if (response.getMaxColumns() - response.getLastColumn() > 0)
        response.deleteColumns(response.getLastColumn() + 1, response.getMaxColumns() - response.getLastColumn());
    if (response.getMaxRows() - response.getLastRow() > 0)
        response.deleteRows(response.getLastRow() + 1, response.getMaxRows() - response.getLastRow());

    //takes user to spreadsheet
    SpreadsheetApp.setActiveSheet(response);
}

/**
 * Filters out rows based off the specified property and value
 * @param {Object[]} all - The spreadsheet data array to filter.
 * @param {number} property - The collumn in the spreadsheet to filter the results by.
 * @param {string[]} value - value(s) to filter properties
 * @param {boolean} name - When ture, it runs the custom filter method for names.
 * @returns {Object[]} Returns the filtered data.
 */
function sortPropertybyRows(all, property, value, name) {
    var properties = [];
    // This should be replaced by a filter function in the future
    for (var i in all) {
        if (typeof value == "string") {
            // if only one value to filter by, check if each row matches the value at the specified collumn
            if (all[i][property - 1].toLowerCase() == value.toLowerCase()) {
                //value matches parameters
                properties.push(all[i]);
            }
        } else if (value.constructor === Array) {
            var j;
            // mutiple values to filter by
            if (name) {
                // filters by first and or last name. Should be replaced by REGEX in the future
                Logger.log("NAME GAME!");
                for (j in value) {
                    // splits name into segments
                    var parts = value[j].trim().split(" ");
                    //checks if the first name matches
                    if (all[i][property - 1].toLowerCase().trim() == parts[0].toLowerCase().trim()) {
                        if (parts.length > 1) {
                            // checks if last anem matches too
                            if (all[i][property].toLowerCase().trim() == parts[1].toLowerCase().trim())
                            //if both match, add to results
                                properties.push(all[i]);
                            else {
                                // this is awkward
                            }
                        } else {
                            //it matches!
                            properties.push(all[i]);
                        }
                    } else {
                        // some additional checking if an item does not match
                        if (parts.length <= 1) {
                            if (parts[0].toLowerCase().trim() == all[i][property].toLowerCase().trim()) {
                                // add to results
                                properties.push(all[i]);
                            }
                        }
                    }
                }
            } else {
                // don't check for name
                Logger.log("So this is how you want it?");
                //got through all the values and if a match is found add it to the results
                for (j in value) {
                    if (all[i][property - 1].trim().toLowerCase() == value[j].trim().toLowerCase()) {
                        properties.push(all[i]);
                    }
                }
            }
        } else {
            //Looks like we can't filter by this data type!
            Logger.log("IMPOSTER!");
        }
    }

    // returns filtered array
    return properties;
}

/**
 * Sends an alert to the screen
 * @param {string} message - The message to display to the user.
 */
function alert(message) {
    SpreadsheetApp.getUi().alert(message);
}

/**
 * Fills replace strings with their proper values from the spreadsheet
 * @param {number} i - The row in the spreadsheet.
 * @param {string} item - The string to modify.
 * @returns {string} String with replaced variables.
 */
function fillVariables(i, item) {
    var rep = SpreadsheetApp.getActive().getSheetByName("View Response");
    var values = rep.getRange(2, 1, rep.getLastRow() - 1, rep.getLastColumn()).getValues();
    item = item.replace(/(\$FIRST\$)/g, values[i][1]);
    item = item.replace(/(\$LAST\$)/g, values[i][2]);
    return item;
}

/**
 * Fills in all canned responses and replace strings
 * @param {string} day - The day for the response.
 * @param {string} data - The ranked canned response data.
 * @param {string} sig - The signature of the person responding that will be appended to the end of all their responses.
 */
function setCan(day, data, sig) {
    Logger.log(data);
    // if a day is specified, set the canned responses to the application memory
    if (day) {
        var stringdata = JSON.stringify(data);
        stringdata.replace(/[=]/g, ":");
        PropertiesService.getDocumentProperties().setProperty(day, stringdata);
    }
    // get the response spreadsheet and values
    var rep = SpreadsheetApp.getActive().getSheetByName("View Response");
    var values = rep.getRange(2, 1, rep.getLastRow() - 1, rep.getLastColumn()).getValues();

    // Feedback Col
    var feedback = 10;

    //goes through and fills all of the response colls based off of the feedback rating
    for (var i in values) {
        if (values[i][feedback] !== "") {
            // gets all of the feedback ratings
            var spl = ("" + values[i][feedback]).split(",");
            // for each rating, add the associated canned responses to the data
            for (var q in spl) {

                if (values[i][feedback - 1] != "")
                //fill in the values if there is no response
                    values[i][feedback - 1] = values[i][feedback - 1].replace(new RegExp("(" + sig + ")", "g"), "") + "\n" + data["can" + spl[q]] + "\n\n" + sig;
                else
                // append the values if there is a resonse
                    values[i][feedback - 1] = data["can" + spl[q]] + "\n\n" + sig;
            }
            //empy the feedbacl collumn
            values[i][feedback] = "";
        } else if (values[i][feedback] == "" && values[i][feedback - 1] != "") {
            //if no feedback rating append signiture
            if (values[i][feedback - 1].indexOf(sig) < 0)
                values[i][feedback - 1] += "\n\n" + sig;
        }

        // fill in replace stings
        values[i][feedback - 1] = fillVariables(i, values[i][feedback - 1]);
    }
    // sets the modified data
    rep.getRange(2, 1, rep.getLastRow() - 1, rep.getLastColumn()).setValues(values);
    //grabs the lobby data
    var lobby = SpreadsheetApp.getActive().getSheetByName("Lobby");
    var lobbyData = lobby.getRange(2, 1, lobby.getLastRow() - 1, lobby.getLastColumn()).getValues();

    //copies modified data to the lobby
    lobby.getRange(2, 1, lobby.getLastRow() - 1, lobby.getLastColumn()).setValues(lobbyData);

}

/**
 * Makes an array of data from the specified column
 * @param {number} col - The spreadsheet collumn to get the array from.
 * @param {boolean} name - When true, special formatting will be applied for names.
 * @returns {Object[]} Array of collumns content.
 */
function getDataFromCol(col, name) {
    var item = [];
    //grabs lobby data
    var lobby = SpreadsheetApp.getActive().getSheetByName("lobby");
    var data = lobby.getRange(2, col, lobby.getLastRow() - 1, 2).getValues();
    //flatens the array and cleans the data
    for (var i in data) {
        var current = data[i][0].trim();
        current += name ? " " + data[i][1].trim() : "";
        if (item.indexOf(current) < 0)
            item.push(current);
    }

    //sorts the array
    item.sort();

    //returns the filtered array
    return item;
}

/**
 * Gets canned responses from the application data
 * @param {string} day - The day for the canned response data.
 * @returns {Object} The canned repsonses for the specified day.
 */
function getCan(day) {
    var data = PropertiesService.getDocumentProperties().getProperty(day) || {
        can1: "",
        can2: "",
        can3: "",
        can4: "",
        can5: ""
    };
    Logger.log(data);
    return data;
}

/**
 * Debugging Function
 * @param {Object} object - The event object on an appscript trigger.
 */
function process(object) {
    Logger.log(object.value, "I was Called!");
}

/**
 * Calculates the Average Student Rating of the Teacher
 * @returns {Object} An object containing the overall average ranking and the filtered average ranking.
 */
function getAverageRank() {
    /**
     * Gets spreadsheet data
     */
    var sheet = SpreadsheetApp.getActive().getSheetByName("lobby");
    var lobby = sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).getValues();
    //grabs the rating from each row
    lobby = lobby.map(function (e) {
        return parseInt(e[0].match(/\d+/g) || "-1", 10);
    });
    //filters out the 0 items
    lobby = lobby.filter(function (item) {
        return item >= 0;
    });

    //calculates the average
    var length = lobby.length;
    lobby = lobby.reduce(function (a, b) {
        return a + b;
    }) / length;

    //gets the response data and repeats the same process
    sheet = SpreadsheetApp.getActive().getSheetByName("View Response");
    var filtered = sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).getValues();
    filtered = filtered.map(function (e) {
        return parseInt(e[0].match(/\d+/g), 10);
    });

    length = filtered.length;
    filtered = filtered.reduce(function (a, b) {
        return a + b;
    }) / length;


    // returns averages for overall and filtered ranks
    return {
        overall: lobby,
        filtered: filtered
    };

}

/**
 * Another Debugging Function
 * @returns {string} Returns the debug string running.
 */
function runMe() {
    Logger.log("run");
    return "running";
}

/**
 * Even Another Debugging Function
 */
function fail() {
    Logger.log("fail");
}