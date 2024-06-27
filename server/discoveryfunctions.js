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
      
      if(urls.length == 0){
        throw new Error("No data");
      }
      syncrDictionary(name, idManga, headers, 'Manganato');
      
      for(let i = 0; i < chapters.length ; i++){
        let html = await getContent(chapters[i]);
        let imgUrls = extractSrc(html, idManga);
        
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
      console.log(mangaUrl)
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
  
  function extractPageNumber(url, pregMatch) {
    const matches = url.match(pregMatch);
    return matches ? parseInt(matches[1], 10) : 0;
  }
  
  
  module.exports = {
    ManganatoDiscovery,
    AnimesamaDiscovery
  };