// discord webhook url = https://discord.com/api/webhooks/1046402781696753715/DuBZxciO1pTDRHq3FnEa2EYsMjI1flapP5wsw_VTDNxUh05TPOPZA2TxJnkZJak8taQy
const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

const artistList = [
  {id: '4NOFcRCgjvnRy8nKVGUM0L', name: 'Steveruu'},
  // {id: '1NspLfgAsucc39MeTipXNy', name: 'CYREX'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  // {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},


];
const discordWebhookUrl = process.env.DISCORD_WEBHOOK;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const artist of artistList) {
    const url = `https://open.spotify.com/artist/${artist.id}`;
    await page.goto(url);
  
    await page.waitForSelector('.Ydwa1P5GkCggtLlSvphs', { visible: true });
  
    const monthlyListeners = await page.evaluate(() => {
      return document.querySelector('.Ydwa1P5GkCggtLlSvphs').textContent;
    });
  
    artist.listeners = parseInt(monthlyListeners.replace(/[^0-9]/g, ''));
  }
  
  artistList.sort((a, b) => {
    return b.listeners - a.listeners;
  });

  // Send the sorted artists data to Discord webhook
  for (const artist of artistList) {
    await axios.post(discordWebhookUrl, {
      // content: `${artist.name} has ${artist.listeners} monthly listeners`
      content: `**tady steveruu, omlouvam se za tento incident, uz se to vickrat nestane :DDDDD**`
    })
    .then(response => {
      console.log('Data sent to Discord webhook.');
    })
    .catch(error => {
      console.log(`Error sending data to Discord webhook: ${error}`);
    });
  }

  await browser.close();
})();

