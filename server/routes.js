const express = require('express');
const { 
    getDictionnary, 
    discovertManganato, 
    getMangaDiscovery, 
    getPageContent, 
    getChapters,
    discovertAnimesama } = require('./controllers');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
router.get('/api/dictionnary', getDictionnary);
router.get('/api/:id', getMangaDiscovery);
router.get('/api/:id/chapter/:chapter', getChapters);
router.get('/api/:id/page/:page', getPageContent);

router.post('/api/discover/manganato', discovertManganato);
router.post('/api/discover/animesama', discovertAnimesama);

module.exports = router;