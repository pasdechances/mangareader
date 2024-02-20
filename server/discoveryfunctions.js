const { 
  write,
  syncrDictionary,
  getContent,
  extractUrls,
  extractSrc } = require('./functions');
  
  async function ManganatoDiscovery(url, idManga, name, headers) {
    try {
      let html = await getContent(url);
      let urls = extractUrls(html, idManga);
      let chapters = urls.reverse();
      let obj = []
      let z = 0;
      console.log(urls)
      if(urls.length == 0){
        throw new Error("No data");
      }
      syncrDictionary(name, idManga, headers, 'Manganato');
      
      for(let i = 0; i < chapters.length ; i++){
        let html = await getContent(chapters[i]);
        let imgUrls = extractSrc(html, idManga);
        console.log(imgUrls)
        imgUrls.forEach((element, index) => {
          obj.push({
            chapter : i,
            chapterPage : index,
            page : z,
            imgURL : element
          })
          z++;
        });
      };
      write(idManga, obj)
      console.log('Manganato -- URLs extraites avec succès : ', name);
    } catch (error) {
      throw  error.message;
    }
  }
  
  async function AnimesamaDiscovery(url, name, headers) {
    try {
      const idManga = encodeURIComponent(name);
      const mangaUrl = `${url}/s1/scans/${idManga}`;
      const html = await getContent(mangaUrl);
      const urls = extractUrls(html, idManga);
      const chapters = urls.sort((a, b) => {
        const numA = parseInt(a.match(/\/(\d+)\//)[1], 10);
        const numB = parseInt(b.match(/\/(\d+)\//)[1], 10);
        return numA - numB;
      });
      let z = 0;
      let obj = [];
      
      if (urls.length === 0) {
        throw new Error("No data");
      }
      
      syncrDictionary(name, idManga, headers, 'AnimeSama');
      
      for (let i = 0; i < chapters.length; i++) {
        let chapterUrl = `${url}${chapters[i]}`;
        let chapterHtml = await getContent(chapterUrl);
        let imgUrls = extractUrls(chapterHtml, idManga).sort((a,b)=>{
          const numA = parseInt(a.match(/\/(\d+).jpg/)[1], 10);
          const numB = parseInt(b.match(/\/(\d+).jpg/)[1], 10);
          return numA - numB;
        });;

        imgUrls.forEach((element, index) => {
          obj.push({
            chapter: i,
            chapterPage: index,
            page: z,
            imgURL: `${url}${element}`
          });
          z++;
        });
      }
      
      write(idManga, obj);
      console.log('AnimeSama -- URLs extraites avec succès : ', name);
    } catch (error) {
      throw error.message;
    }
  }



  // url   https://phenixscans.fr/manga/99-latna-saga-survival-of-a-sword-king-v45860650/
  // id    latna-saga-survival-of-a-sword-king
  // name  latna saga
//  https://phenixscans.fr/latna-saga-survival-of-a-sword-king-chapitre-143/
// https://phenixscans.fr/wp-content/uploads/2023/05/1-644e8fe6-5e3a-45d1-b5d8-4f4c7a6f961b.jpeg
  async function PhenixscansDiscovery(url, idManga, name, headers) {
    try {
      const html = await getContent(url);
      const urls = extractUrls(html, idManga);
      const uniqueChaptersSet = new Set(urls.filter(url => url.includes('chapitre')));
      const chaptersArray = Array.from(uniqueChaptersSet);
      const chapters = chaptersArray.sort((a, b) => {
        const numA = parseInt(a.match(/-chapitre-(\d+)/)[1], 10);
        const numB = parseInt(b.match(/-chapitre-(\d+)/)[1], 10);
        return numA - numB;
      });

      let z = 0;
      let obj = [];
      
      if (urls.length === 0) {
        throw new Error("No data");
      }
      
      // syncrDictionary(name, idManga, headers, 'Phenixscans');
      
      //for (let i = 0; i < chapters.length; i++) {
      for (let i = 0; i < 3; i++) {
        let chapterHtml = await getContent(chapters[i]);
        let imgUrls = extractSrc(chapterHtml, "wp-content/uploads");
        console.log(imgUrls, chapters[i])
        // imgUrls.sort((a,b)=>{
        //   const numA = parseInt(a.match(/\/(\d+).jpg/)[1], 10);
        //   const numB = parseInt(b.match(/\/(\d+).jpg/)[1], 10);
        //   return numA - numB;
        // });

        // imgUrls.forEach((element, index) => {
        //   obj.push({
        //     chapter: i,
        //     chapterPage: index,
        //     page: z,
        //     imgURL: `${url}${element}`
        //   });
        //   z++;
        // });
      }
      
      // write(idManga, obj);
      console.log('Phenixscans -- URLs extraites avec succès : ', name);
    } catch (error) {
      console.log(error)
      throw error.message;
    }
  }
  



  
  module.exports = {
    ManganatoDiscovery,
    AnimesamaDiscovery,
    PhenixscansDiscovery
  };