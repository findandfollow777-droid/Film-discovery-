import https from "https";
const K = process.env.TMDB_API_KEY;
if (!K) { console.error("Set TMDB_API_KEY env var before running."); process.exit(1); }
function f(u){return new Promise((ok,no)=>{https.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>{try{ok(JSON.parse(d))}catch(e){no(e)}})}).on("error",no)})}
const B="https://api.themoviedb.org";
async function g(i){let d=await f(B+"/3/movie/"+i+"?api_key="+K);return[d.title,d.id,d.poster_path]}
async function s(t,y){let u=B+"/3/search/movie?api_key="+K+"&query="+encodeURIComponent(t);if(y)u+="&year="+y;let d=await f(u);if(d.results&&d.results.length>0){let r=d.results[0];return[r.title,r.id,r.poster_path]}return[t,"?","?"]}
const w=ms=>new Promise(r=>setTimeout(r,ms));
const ids=[915935,497828,496243,945961,399579,792307,515001,475557,348350,399055,872585,785084,843241,530915,359940,313369,205587,109414,674324,804095,585245,466272,490132,391713,286217,120467,424694,376867,776503,614917,399404,321612,87516,637920,375262,264644];
const sq=[["Anora",2024],["Titane",2021],["Shoplifters",2018],["The Square",2017],["I Daniel Blake",2016],["Dheepan",2015],["All We Imagine as Light",2024],["Close",2022],["A Hero",2021],["Atlantics",2019],["BPM Beats per Minute",2017]];
const sq2=[["Son of Saul",2015],["The Room Next Door",2024],["All the Beauty and the Bloodshed",2022],["Happening",2021],["The Woman Who Left",2016],["From Afar",2015],["Dahomey",2024],["On the Adamant",2023],["Alcarras",2022],["Bad Luck Banging or Loony Porn",2021]];
const sq3=[["There Is No Evil",2020],["Synonyms",2019],["Touch Me Not",2018],["On Body and Soul",2017],["Fire at Sea",2016],["Taxi",2015],["Borat Subsequent Moviefilm",2020],["The Whale",2022],["The Eyes of Tammy Faye",2021],["Judy",2019],["Still Alice",2014]];
const allsq=[...sq,...sq2,...sq3];
async function main(){
console.log("=== BY ID ===");
for(let i=0;i<ids.length;i+=5){let b=ids.slice(i,i+5);let r=await Promise.all(b.map(x=>g(x)));r.forEach(x=>console.log(x[0]+" | "+x[1]+" | "+x[2]));await w(300)}
console.log("=== BY SEARCH ===");
for(let i=0;i<allsq.length;i+=5){let b=allsq.slice(i,i+5);let r=await Promise.all(b.map(x=>s(x[0],x[1])));r.forEach(x=>console.log(x[0]+" | "+x[1]+" | "+x[2]));await w(300)}
}main().catch(e=>console.error(e));
