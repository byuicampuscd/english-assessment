/***********************************************
 *            
 * When you are adding an assessment to a course,
 * you have to select many options.  I wrote a 
 * tool that would allow you to import those 
 * settings from your hard-drive in the form of 
 * a JSON file, but those files still had to be 
 * created for every assessment day. 
 * 
 * This tool automates that process a little.
 * It takes input in the form of a csv, and creates
 * all of the JSON files from that input.
 * 
 ***********************************************/

const d3 = require('d3-dsv');
const fs = require('fs');
// Validate JSON
const validate = require('validator').isJSON;

/***********************************************
 *            writeFile(contentObj)
 * 
 * Write valid JSON file to specified location
 * on the hard drive
 * 
 * 
 * @param {Obj} contentObj The object of contents  
 * ```js
  {day: ${DayToPostQuestion: String},
  title: ${fileName: String},
  content: ${JSONObj: JSON}}```
 * 
 ***********************************************/
async function writeFile(contentObj) {
    let title = contentObj.title;
    let content = contentObj.json;
    let location = './assessments';

    /** 
     * Check if the file exists, and write it if it doesn't
     * Taken from StackOverflow
     * https://stackoverflow.com/questions/21194934/node-how-to-create-a-directory-if-doesnt-exist#answer-48436466
     */
    !fs.existsSync(location) && fs.mkdirSync(location);


    await fs.writeFile(`${location}/${title}.json`, content, (err) => {
        if (err) {
            throw err;
        }
        console.log(`${title} written`);
    });
}

/**
 * Error Handling function
 * Just print the error to the console
 */
function errorHandler(message) {
    console.error(message);
}

/***********************************************
 *               main()
 * 
 *  Process:    
 *      Read the csv file  
 *      Reduce it down to just the column that we want  
 *      Check if it's valid JSON  
 *      Write the file to the hard-drive
 * 
 ***********************************************/
function main() {
    // CSV should be in the same directory as the JS file
    let csv = fs.readFileSync('./theJSONObjects.csv', 'utf-8');

    let parsedCsv = d3.csvParse(csv);

    let outputJson = parsedCsv.reduce((acc, el) => {
        if (el.Question) {
            acc.push({
                day: el.Day,
                title: `assessment_${el.Day.replace(' ', '_')}`,
                json: el.Correct
            });
        }
        return acc;
    }, []);

    outputJson.forEach(el => {

        // Check if the json we have is valid json
        if (validate(el.json)) {
            writeFile(el).catch((e) => {
                errorHandler(e);
            });
        } else {
            errorHandler(`${el.title} does not contain valid JSON`);
        }
    });
}
main();