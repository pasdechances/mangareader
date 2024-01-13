const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

function write(filename, data){
    try {    
        fs.writeFileSync(__dirname + "/files/" + filename + ".json", JSON.stringify(data,null,1));    
        console.log('data save');
    } catch (error) {
        console.error("Une erreur est survenue lors de l'ecriture du fichier:", error.message);
    }
}

// Fonction pour lire les URLs depuis un fichier
function read(filename) {
    try {
        const content = fs.readFileSync(__dirname + "/files/" + filename + ".json");
        return JSON.parse(content);
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error.message);
        throw error;
    }
}

function syncrDictionary(name, id, headers, discoveredOn){
    let content = read(global.config.dictionnaryFileName);
    let test = content.filter(el => el.id === id && el.discoveredOn === discoveredOn).length
    if (!test){
      content.push({
        "discoveredOn": discoveredOn,
        "id": id,
        "name": name,
        "headers" : headers
       })
    }
    write(global.config.dictionnaryFileName, content);
}

async function getContent(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la page:', error.message);
        throw error;
    }
}

// Fonction pour extraire les URLs des balises HTML spécifiées
function extractUrls(html, idManga) {
    const $ = cheerio.load(html);
    const urls = [];
  
    $("a").each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            if(href.includes(idManga)) urls.push(href);
        }
    });
  
    return urls;
}

// Fonction pour extraire les URLs des balises HTML spécifiées
function extractSrc(html, idManga) {
    const $ = cheerio.load(html);
    const urls = [];
  
    $("img").each((index, element) => {
        const src = $(element).attr('src');
        if (src) {
            if(src.includes(idManga)) urls.push(src);
        }
    });
  
    return urls;
}

function downloadImage(url, headers) {
    let config = {
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        headers,
    }
    return axios(config)
}


module.exports = {
    write,
    read,
    syncrDictionary,
    getContent,
    extractUrls,
    extractSrc,
    downloadImage
};