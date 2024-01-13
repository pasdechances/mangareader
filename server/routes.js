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
router.get('/api/manga/:id', getMangaDiscovery);
router.get('/api/manga/:id/chapter/:chapter', getChapters);
router.get('/api/manga/:id/page/:page', getPageContent);

router.post('/api/discover/manganato', discovertManganato);
router.post('/api/discover/animesama', discovertAnimesama);

module.exports = router;