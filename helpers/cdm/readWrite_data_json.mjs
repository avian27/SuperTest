import * as fs from 'fs';

export function appendToFile(filename, key, value) {
    let data = {};
    if (fs.existsSync(filename)) {
      const fileData = fs.readFileSync(filename, 'utf8');
      try {
        data = JSON.parse(fileData);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        return;
      }
    }
    data[key] = value;
    const jsonData = JSON.stringify(data);
    try {
      fs.writeFileSync(filename, jsonData, 'utf8');
    } catch (error) {
      console.error('Error writing data to file:', error);
    }
}

export function getValueFromFile(filename, key) {
    if (!fs.existsSync(filename)) {
        console.log('File does not exist.');
        return;
    }
    const fileData = fs.readFileSync(filename, 'utf8');
    let data = {};
    try {
        data = JSON.parse(fileData);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        return;
    }
    const value = data[key];
    if (value === undefined) {
        console.log(`Key '${key}' does not exist.`);
        return null;
    } else {
        return value; 
    }
}