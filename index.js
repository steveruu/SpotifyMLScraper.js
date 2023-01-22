// discord webhook url = https://discord.com/api/webhooks/1046402781696753715/DuBZxciO1pTDRHq3FnEa2EYsMjI1flapP5wsw_VTDNxUh05TPOPZA2TxJnkZJak8taQy
const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

const artistList = [
  {id: '4NOFcRCgjvnRy8nKVGUM0L', name: 'Steveruu'},
  {id: '3GuGHOzPZ0AhH9hK8LqCsK', name: 'JDSLVT'},
  {id: '1NspLfgAsucc39MeTipXNy', name: 'CYREX'},
  {id: '5VW7PyWYrxkuWlzSxic7N2', name: 'HKLS'},
  {id: '3xVvsXvpURgj3zeTYiBtCv', name: 'Valisbeats'},
  {id: '6kEMNp6TPPl70gOicGT0uN', name: 'ACXD PLAYA'},
  {id: '50ENuvgRkFZ5hMA0BFEeAM', name: 'Hellxn'},
  {id: '2qSLwqeQFUHWEzC86u3vRM', name: 'AWXKEN'},
  {id: '2HJYEBrWgHX2MtQng48uSw', name: 'GMANE'},
  {id: '2b5QC4KWCMRKdD7LiqvfMQ', name: 'FAON'},
  {id: '3D57Cu0cu9caAvtl41xUx6', name: 'SXMYU3RU'},
  {id: '5NTcWbyHYQjA20voWilXeG', name: 'kill4sky'},
  {id: '0cpiDjS2bR8rWA8JLhU2uM', name: 'GiverT'},
  {id: '7h22ZneYwwRyOwlgnMd8So', name: 'Querky'},
  {id: '1HbkAuG6cZndTXlORaQgOq', name: 'sadz'},
  {id: '5QvicxsGxXNicXu1f9guia', name: 'YUI PLAYA'},
  {id: '3tjBt96Yk1zS14xc8wldlT', name: 'FEMBOY PLAYA'},
  {id: '02pls7VjPaXvSbarvDUW7p', name: 'MAROS'},
  {id: '34YDbjVGCySBRPAS19xl1L', name: 'PLAYADOMI'},
  {id: '1tqkzvbam2vnrUdredtErd', name: 'Shvttxrd'},
  {id: '5PNDGjJ1e6Tdr8LWmZDqPO', name: 'noT ghxst'},
  {id: '2GaadbJKN8S8PbST0XwwQD', name: 'xfgin'},
  {id: '0IM0lwjzI0BYaayMweraKT', name: 'Lonnex'},
  {id: '2IIf5hkbIzh1dqhG1T132E', name: 'COBRA 808'},
  {id: '3TTWuZxamiQERzR42VNMS5', name: 'VESUV'},
  {id: '6JHPfVpbSjecbv3oAOJSov', name: 'DXNTR BXNTR'},
  {id: '1hRLNOS6wPhSMLfXVaJk5t', name: 'Akuda'},
  {id: '6UIdgISBaIHMOvWwz4nfP1', name: 'PRASSOZMRD'},
  {id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda'},
  {id: '30ZlxBZfVVt67x1giU0xa4', name: 'Hakalas'}
]

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
      // content: `${artist.name} – ${artist.listeners} posluchačů měsíčně`
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

