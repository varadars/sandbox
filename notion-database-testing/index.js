import dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config();

// document.addEventListener('DOMContentLoaded', () => {
//     dotenv.config();
//     const databaseId = process.env.EXPENSES_DATABASE_ID;

//     const heading = document.getElementById('h1');

//     queryDatabaseAll(databaseId)
//     .then(result => {
//         heading.textContent = result;
//     });

// });

queryDatabaseAll(process.env.EXPENSES_DATABASE_ID);

async function queryDatabaseAll(databaseId) {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(
      response.results[0].properties["Amount for Chart"]
        .formula
    );
  } catch (error) {
    console.log(error.body);
  }
}
