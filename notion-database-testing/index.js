const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

queryDatabase(databaseId, '우유')
    .then(result => {
        console.log(result);
    });

async function queryDatabase(databaseId, word) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId
          });

        let english = [];

        //return response.results.length;
        
        for (let i = 0; i < response.results.length; i++) {
            english.push(response.results[i].properties.English.rich_text[0].plain_text);
        }

        return english;
    } catch (error){
        console.log(error.body);
    }
}