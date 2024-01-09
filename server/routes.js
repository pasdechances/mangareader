const express = require('express');
const { 
    getDictionnary, 
    discovertManganato, 
    getMangaDiscovery, 
    getPageContent, 
    getChapters,
    discovertAnimesama } = require('./controllers');
const router = express.Router();

router.get('/', getDictionnary);
router.get('/:id', getMangaDiscovery);
router.get('/:id/chapter/:chapter', getChapters);
router.get('/:id/page/:page', getPageContent);

router.post('/discover/manganato', discovertManganato);
router.post('/discover/animesama', discovertAnimesama);

module.exports = router;