const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

queryDatabaseAll(databaseId)
    .then(result => {
        console.log(result);
    });

async function queryDatabaseAll(databaseId, word) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId
          });

        let english = [];

        //return response.results[0].properties.Word.title[0].plain_text;
        
        for (let i = 0; i < response.results.length; i++) {
            let pair = [];
            pair.push(response.results[i].properties.Word.title[0].plain_text);
            pair.push(response.results[i].properties.English.rich_text[0].plain_text);
            english.push(pair);
        }

        return english;
    } catch (error){
        console.log(error.body);
    }
}