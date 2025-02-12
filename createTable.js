import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

// Database configuration
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
};

async function createTables() {
  const connection = await mysql.createConnection(dbConfig);

  const createSheet1Query = `
    CREATE TABLE IF NOT EXISTS sheet1 (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timeStamp DATETIME,
      RecruitmentArea VARCHAR(255),
      Firstname VARCHAR(255),
      Lastname VARCHAR(255),
      Sex VARCHAR(10),
      Age INT,
      Gpa DECIMAL(3,2),
      Major VARCHAR(255),
      EducationalInstitution VARCHAR(255),
      Phonenum VARCHAR(15) UNIQUE,
      LineID VARCHAR(50),
      PhysicalCondition VARCHAR(50),
      MilitaryStatus VARCHAR(50),
      pregnant VARCHAR(10),
      DrivingSkills VARCHAR(50),
      Experience TEXT,
      Hearabout TEXT,
      Consent VARCHAR(10)
    )
  `;

  const createSheet2Query = `
    CREATE TABLE IF NOT EXISTS sheet2 (
      timeStamp DATETIME, 
      Score VARCHAR(50), 
      Firstname VARCHAR(255), 
      Lastname VARCHAR(255), 
      Nickname VARCHAR(255), 
      Phonenum VARCHAR(20) UNIQUE, 
      Gpa DECIMAL(3,2), 
      Major VARCHAR(255), 
      EducationalInstitution VARCHAR(255)
    )
  `;

  try {
    await connection.execute(createSheet1Query);
    console.log('Table sheet1 is ready.');
    await connection.execute(createSheet2Query);
    console.log('Table sheet2 is ready.');

    const sheet1Path = path.resolve('answers.json');
    const sheet2Path = path.resolve('answer1.json');
    const sheet1Data = JSON.parse(await fs.readFile(sheet1Path, 'utf8'));
    const sheet2Data = JSON.parse(await fs.readFile(sheet2Path, 'utf8'));

    for (const item of sheet1Data) {
      const insertSheet1 = `
        INSERT IGNORE INTO sheet1 (
          timeStamp, RecruitmentArea, Firstname, Lastname, Sex, Age, Gpa, Major, EducationalInstitution, Phonenum,
          LineID, PhysicalCondition, MilitaryStatus, pregnant, DrivingSkills, Experience, Hearabout, Consent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(insertSheet1, [
        new Date(item.timeStamp), item.RecruitmentArea, item.Firstname, item.Lastname, item.Sex, parseInt(item.Age),
        null, item.Major, item.EducationalInstitution, item.Phonenum,
        item.LineID, item.PhysicalCondition, item.MilitaryStatus, item.pregnant, item.DrivingSkills, item.Experience, item.Hearabout, item.Consent
      ]);
    }
    console.log('Data inserted into sheet1.');

    for (const item of sheet2Data) {
      const insertSheet2 = `
        INSERT IGNORE INTO sheet2 (
          timeStamp, Score, Firstname, Lastname, Nickname, Phonenum, Gpa, Major, EducationalInstitution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(insertSheet2, [
        new Date(item.timeStamp), item.Score, item.Firstname, item.Lastname, item.Nickname, item.Phonenum,
        parseFloat(item.Gpa), item.Major, item.EducationalInstitution
      ]);
    }
    console.log('Data inserted into sheet2.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTables();
}

export { createTables };
