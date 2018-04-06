# english-assessment

## Making a Copy
You need access to the google account with the source files. Ask Br. Kendall Grant for credentials.

The "Response Viewer - Master Code" file is the script that contains, you guessed it, the master code for the tool. This is where you will make updates.

To create a new instance of this tool, you can do a few things. The simplest thing to do is copy the existing sheet and link a NEW form to it. Find the sheet template in the "Template" directory of the Google Drive and make a new copy. Esnure that you have permission to access/edit the RVMC code. In the newly made templated sheet copy, test your linked form to ensure that responses show up as expected (in the dump tab).  

In the "question links" tab, add the questions you want to use on the form in your course. You can use as many or as few as you like, though the default is 42. Do not touch column C of this sheet, it creates the links for you. Copy and paste the links directly into your course.

Ensure that the id of the "Form Link" in the "question links" tab matches the form id of the linked form.

## Making Changes

If you are maintaining the code, you will need to keep some things in mind. When you need to add functionality to the student viewer, you need to add code in 3 places.

1. In "Response Viewer - Master Code" you need to add the basic functionality of your script to "sidebar.html" this usually means grabbing your variables from the page then ussing "google.script.run.FUNCTIONNAME(PARAMS)" to call the code from "Code.gs"
2. In "Code.gs" write the acutal code you will be using.
3. In the Script Editor for your copy of the tool, add the new function following the format of all the others:

``` JS
// if you need data returned
// technically you can just do it this way no matter what
function funcName(params){
    return RVMC.funcName(params);
}
// only if you do not need data returned
function funcName(params){
    RVMC.funcName(params);
}

```

If you ever add a feature to RVMC, remember to add it to the script editor for your file ***AND*** the template file.

## Functions

<dl>
<dt><a href="#pullDataFromDump">pullDataFromDump()</a></dt>
<dd><p>Takes the raw form input and converts it into the grading format</p>
</dd>
<dt><a href="#runTest">runTest()</a></dt>
<dd><p>Debugging changes in the global library</p>
</dd>
<dt><a href="#resetIndex">resetIndex()</a></dt>
<dd><p>Changes last index back to 1</p>
</dd>
<dt><a href="#launchSideBar">launchSideBar()</a></dt>
<dd><p>Shows the search bar</p>
</dd>
<dt><a href="#onOpen">onOpen()</a></dt>
<dd><p>Creates the options menu when the application is opened and then opens/refreshes the sidebar.</p>
</dd>
<dt><a href="#sendAll">sendAll()</a></dt>
<dd><p>Finds all new responses and sends them to each stu</p>
</dd>
<dt><a href="#sortByParameter">sortByParameter(day, courses, stud)</a></dt>
<dd><p>Returns lobby data that matches all of the provided criteria</p>
</dd>
<dt><a href="#sortPropertybyRows">sortPropertybyRows(all, property, value, name)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Filters out rows based off the specified property and value</p>
</dd>
<dt><a href="#alert">alert(message)</a></dt>
<dd><p>Sends an alert to the screen</p>
</dd>
<dt><a href="#fillVariables">fillVariables(i, item)</a> ⇒ <code>string</code></dt>
<dd><p>Fills replace strings with their proper values from the spreadsheet</p>
</dd>
<dt><a href="#setCan">setCan(day, data, sig)</a></dt>
<dd><p>Fills in all canned responses and replace strings</p>
</dd>
<dt><a href="#getDataFromCol">getDataFromCol(col, name)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Makes an array of data from the specified column</p>
</dd>
<dt><a href="#getCan">getCan(day)</a> ⇒ <code>Object</code></dt>
<dd><p>Gets canned responses from the application data</p>
</dd>
<dt><a href="#process">process(object)</a></dt>
<dd><p>Debugging Function</p>
</dd>
<dt><a href="#getAverageRank">getAverageRank()</a> ⇒ <code>Object</code></dt>
<dd><p>Calculates the Average Student Rating of the Teacher</p>
</dd>
<dt><a href="#runMe">runMe()</a> ⇒ <code>string</code></dt>
<dd><p>Another Debugging Function</p>
</dd>
<dt><a href="#fail">fail()</a></dt>
<dd><p>Even Another Debugging Function</p>
</dd>
    <dt><a href="#archive">archive()</a></dt>
<dd><p>Preserve data from older semesters and remove it from the Dump/Lobby</p>
</dd>
</dl>

<a name="pullDataFromDump"></a>

## pullDataFromDump()
Takes the raw form input and converts it into the grading format

**Kind**: global function  
<a name="runTest"></a>

## runTest()
Debugging changes in the global library

**Kind**: global function  
<a name="resetIndex"></a>

## resetIndex()
Changes last index back to 1

**Kind**: global function  
<a name="launchSideBar"></a>

## launchSideBar()
Shows the search bar

**Kind**: global function  
<a name="onOpen"></a>

## onOpen()
Creates the options menu when the application is opened and then opens/refreshes the sidebar.

**Kind**: global function  
<a name="sendAll"></a>

## sendAll()
Finds all new responses and sends them to each stu

**Kind**: global function  
<a name="sortByParameter"></a>

## sortByParameter(day, courses, stud)
Returns lobby data that matches all of the provided criteria

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | Filters resonses for specified day(s). Multiple day filters are applied when the string contains multiple days separated by commas. Ex: "Day 1,Day 2,Day 3" |
| courses | <code>string</code> | Filters resonses for the specified class(es). Multiple class filters are applied when the string contains multiple classes separated by commas. Ex: "SAN 101,TST 210,PLY 315" |
| stud | <code>string</code> | Filters resonses for the specified student(s). Multiple student filters are applied when the string contains multiple names separated by commas. Ex: "John Doe , Derek Zoolander, Paul Rice" If a full name is specified, it will filter each result by the full name. If only one name if provided, it will filter results that contain the specified name. Ex: the fiter "Zoolander" would accept the names: Derek Zoolander, Zoolander, Zoolander Derek |

<a name="sortPropertybyRows"></a>

## sortPropertybyRows(all, property, value, name) ⇒ <code>Array.&lt;Object&gt;</code>
Filters out rows based off the specified property and value

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - Returns the filtered data.  

| Param | Type | Description |
| --- | --- | --- |
| all | <code>Array.&lt;Object&gt;</code> | The spreadsheet data array to filter. |
| property | <code>number</code> | The collumn in the spreadsheet to filter the results by. |
| value | <code>Array.&lt;string&gt;</code> | value(s) to filter properties |
| name | <code>boolean</code> | When ture, it runs the custom filter method for names. |

<a name="alert"></a>

## alert(message)
Sends an alert to the screen

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message to display to the user. |

<a name="fillVariables"></a>

## fillVariables(i, item) ⇒ <code>string</code>
Fills replace strings with their proper values from the spreadsheet

**Kind**: global function  
**Returns**: <code>string</code> - String with replaced variables.  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | The row in the spreadsheet. |
| item | <code>string</code> | The string to modify. |

<a name="setCan"></a>

## setCan(day, data, sig)
Fills in all canned responses and replace strings

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | The day for the response. |
| data | <code>string</code> | The ranked canned response data. |
| sig | <code>string</code> | The signature of the person responding that will be appended to the end of all their responses. |

<a name="getDataFromCol"></a>

## getDataFromCol(col, name) ⇒ <code>Array.&lt;Object&gt;</code>
Makes an array of data from the specified column

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of collumns content.  

| Param | Type | Description |
| --- | --- | --- |
| col | <code>number</code> | The spreadsheet collumn to get the array from. |
| name | <code>boolean</code> | When true, special formatting will be applied for names. |

<a name="getCan"></a>

## getCan(day) ⇒ <code>Object</code>
Gets canned responses from the application data

**Kind**: global function  
**Returns**: <code>Object</code> - The canned repsonses for the specified day.  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | The day for the canned response data. |

<a name="process"></a>

## process(object)
Debugging Function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The event object on an appscript trigger. |

<a name="getAverageRank"></a>

## getAverageRank() ⇒ <code>Object</code>
Calculates the Average Student Rating of the Teacher

**Kind**: global function  
**Returns**: <code>Object</code> - An object containing the overall average ranking and the filtered average ranking.  
<a name="getAverageRank..sheet"></a>

### getAverageRank~sheet
Gets spreadsheet data

**Kind**: inner property of <code>[getAverageRank](#getAverageRank)</code>  
<a name="runMe"></a>

## runMe() ⇒ <code>string</code>
Another Debugging Function

**Kind**: global function  
**Returns**: <code>string</code> - Returns the debug string running.  
<a name="fail"></a>

## fail()
Even Another Debugging Function

**Kind**: global function  

## archive()
Removes the entries of any given semester from Lobby and Dump, then stores that data in it's own semester specific sheet.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| semester | <code>string</code> | The name of the semester to archive. |
