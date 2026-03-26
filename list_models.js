const https = require('https');

const apiKey = "AIzaSyB7LCLv01spD_N6l7KoHuM7xL6cJqnc0Kw";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Listing models...");

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const models = JSON.parse(data);
      console.log('Available Models:', models.models?.map(m => m.name).join(', '));
    } catch (e) {
      console.log('Raw Data:', data);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
