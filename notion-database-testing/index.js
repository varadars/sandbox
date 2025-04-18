import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

document.addEventListener('DOMContentLoaded', () => {
    dotenv.config();
    const databaseId = process.env.EXPENSES_DATABASE_ID;

    const heading = document.getElementById('h1');

    queryDatabaseAll(databaseId)
    .then(result => {
        heading.textContent = result;
    });

});

async function queryDatabaseAll(databaseId, word) {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    try {
        const response = await notion.databases.query({
            database_id: databaseId
          });

        let length = response.results.length;

        for(let i = 0; i < length; i++)
        {

        }
        console.log(response.results[0].properties["Jar"]);    

        return "hello"

    } catch (error){
        console.log(error.body);
    }
}