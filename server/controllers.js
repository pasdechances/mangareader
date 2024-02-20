const {
    read,
    downloadImage } = require('./functions');
const { ManganatoDiscovery,
    AnimesamaDiscovery,
    PhenixscansDiscovery } = require('./discoveryfunctions');


async function discovertManganato(req, res){
    try {
        await ManganatoDiscovery(
            req.body.url,
            req.body.id,
            req.body.name,
            req.body.headers
        );
        res.status(201).send('Discovery successful');
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function discovertPhenixscans(req, res){
    try {
        await PhenixscansDiscovery(
            req.body.url,
            req.body.id,
            req.body.name,
            req.body.headers
        );
        res.status(201).send('Discovery successful');
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function discovertAnimesama(req, res){
    try {
        await AnimesamaDiscovery(
            req.body.url,
            req.body.name,
            req.body.headers
        );
        res.status(201).send('Discovery successful');
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

function getMangaDiscovery(req, res){
    let jsonData = read(encodeURIComponent(req.params.id));
    res.status(200).json(jsonData);
}

function getDictionnary(req, res){
    let jsonData = read(global.config.dictionnaryFileName);
    res.status(200).json(jsonData);
};

function getPageContent(req, res){
    let infos = read(global.config.dictionnaryFileName).find(el => el.id == encodeURIComponent(req.params.id));
    let jsonData = read(encodeURIComponent(req.params.id));
    let page = jsonData.find(el => el.page == req.params.page);

    downloadImage(page.imgURL, infos.headers)
        .then(response => {
            res.status(200).json(
                Buffer.from(response.data, 'binary').toString('base64')
            );
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

function getChapters(req, res){
    let jsonData = read(encodeURIComponent(req.params.id));
    let chapter = jsonData.filter(el => el.chapter == req.params.chapter)
    res.status(200).json(chapter);
}

module.exports = {
    getDictionnary,
    discovertManganato,
    getMangaDiscovery,
    getPageContent,
    getChapters,
    discovertAnimesama,
    discovertPhenixscans
};