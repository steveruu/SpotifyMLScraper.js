const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1; // wtf
let year = date.getFullYear();

let currentDate = `${day}/${month}/${year}`;

const artistList = [
  { id: '4NOFcRCgjvnRy8nKVGUM0L', name: 'Steveruu' },
  { id: '3GuGHOzPZ0AhH9hK8LqCsK', name: 'JDSLVT' }, 
  { id: '1NspLfgAsucc39MeTipXNy', name: 'CYREX' },
  { id: '5VW7PyWYrxkuWlzSxic7N2', name: 'HKLS' },
  { id: '3xVvsXvpURgj3zeTYiBtCv', name: 'Valisbeats' },
  { id: '6kEMNp6TPPl70gOicGT0uN', name: 'ACXD PLAYA' },
  { id: '50ENuvgRkFZ5hMA0BFEeAM', name: 'Hellxn' },
  { id: '2qSLwqeQFUHWEzC86u3vRM', name: 'AWXKEN' },
  { id: '2HJYEBrWgHX2MtQng48uSw', name: 'GMANE' },
  { id: '2b5QC4KWCMRKdD7LiqvfMQ', name: 'FAON' },
  { id: '3D57Cu0cu9caAvtl41xUx6', name: 'SXMYU3RU' },
  { id: '5NTcWbyHYQjA20voWilXeG', name: 'kill4sky' },
  { id: '0cpiDjS2bR8rWA8JLhU2uM', name: 'GiverT' },
  { id: '7h22ZneYwwRyOwlgnMd8So', name: 'Querky' },
  { id: '1HbkAuG6cZndTXlORaQgOq', name: 'sadz' },
  { id: '5QvicxsGxXNicXu1f9guia', name: 'YUI PLAYA' },
  { id: '3tjBt96Yk1zS14xc8wldlT', name: 'FEMBOY PLAYA' },
  { id: '02pls7VjPaXvSbarvDUW7p', name: 'MAROS' },
  { id: '1tqkzvbam2vnrUdredtErd', name: 'Shvttxrd' },
  { id: '5PNDGjJ1e6Tdr8LWmZDqPO', name: 'noT ghxst' },
  { id: '2GaadbJKN8S8PbST0XwwQD', name: 'xfgin' },
  { id: '0IM0lwjzI0BYaayMweraKT', name: 'Lonnex' },
  { id: '2IIf5hkbIzh1dqhG1T132E', name: 'COBRA 808' },
  { id: '3TTWuZxamiQERzR42VNMS5', name: 'VESUV' },
  { id: '6JHPfVpbSjecbv3oAOJSov', name: 'DXNTBXTHER' },
  { id: '1hRLNOS6wPhSMLfXVaJk5t', name: 'Akuda' },
  { id: '6UIdgISBaIHMOvWwz4nfP1', name: 'PRASSOZMRD' },
  { id: '569eihmWcdg4HvSPDnjlPn', name: 'Ondrejoda' },
  { id: '1lc5n2pQ6NFSFcSFTnJUFX', name: 'PHONK CZ/SK' },
  { id: '500spF7xFcONsMI7ha29IQ', name: 'PAXNKOXD' },
  { id: '5oqO5h9gUdtVFfj5l3RNOg', name: 'Matěj Syrový' },
  { id: '1Ua2qIskijOuQdRMt9rbDq', name: 'SCEPTRUM'},
  { id: '4551yzmt7C1DbJkCeaKKpY', name: 'CORXNULL'},
  { id: '7lv9NFUQpzzuVMseM2XP0p', name: 'Steveruu MAROS'},
]

const webhookURL = process.env.DISCORD_WEBHOOK;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // scraping artist data 
  for (const artist of artistList) {
    console.log(`New artist ${artist.name}!`);
    console.log(`Processing artist ${artist.name}...`);
    
    const url = `https://open.spotify.com/artist/${artist.id}`;
    await page.goto(url);
    
    console.log(`Loading ${artist.name}'s Spotify website...`);

    // fetching monthly listeners data
    await page.waitForSelector('.Ydwa1P5GkCggtLlSvphs', { visible: true });
    const monthlyListeners = await page.evaluate(() => {
      return document.querySelector('.Ydwa1P5GkCggtLlSvphs').textContent;
    });
    console.log(`Fetching ${artist.name}'s monthly listeners.`);

    artist.listeners = parseInt(monthlyListeners.replace(/[^0-9]/g, '')); // da pryc vsechno krome cisel
    artist.nonParsedListeners = monthlyListeners.replace(/[^0-9\s]/g, ''); // da pryc vsechno krome cisel a mezer? should work
  }

  console.log("Successfully fetched all artists, beginning sorting process.")

  // sorting artists in artistList[] array by artist.listeners variable
  artistList.sort((a, b) => {
    return b.listeners - a.listeners;
  });
  
  console.log("Finished sorting array."); // tohle mi neskutecne zaspamovalo konzoli XDDD

  // send update date via Discord webhook
  await axios.post(webhookURL, {
    content: `update **${currentDate}:**`
  })
    .then(response => {
      console.log(`Update data sent to Discord webhook.`);
    })
    .catch(error => {
      console.log(`Error sending data to Discord webhook: ${error}`);
    });

  // send the sorted artists data to discord webhook
  for (const artist of artistList) {
    await axios.post(webhookURL, {
      content: `${artist.name} – **${artist.nonParsedListeners}**posluchačů měsíčně`
    })
      .then(response => {
        console.log(`${artist.name}'s data sent to Discord webhook.`);
      })
      .catch(error => {
        console.log(`Error sending ${artist.name}'s data to Discord webhook: ${error}`);
      });
  }

  console.log("Closing browser.");
  await browser.close();
})();

