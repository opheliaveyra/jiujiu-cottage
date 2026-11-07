const { chromium } = require("playwright");
const fs = require("node:fs");
fs.mkdirSync("qa-illustrated", {recursive: true});
const summary=[];
async function run(){
 const browser=await chromium.launch({headless:true,executablePath:"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
 for (const device of [
   {name:"desktop",width:1440,height:900,mobile:false},
   {name:"phone390",width:390,height:844,mobile:true},
   {name:"phone360",width:360,height:800,mobile:true}
 ]){
   const p=await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,isMobile:device.mobile,hasTouch:device.mobile});
   const rec={device:device.name,checks:{},errors:[]};
   p.on("pageerror",e=>rec.errors.push(e.message));
   try{
     const res=await p.goto("http://127.0.0.1:4173/illustrated-preview.html",{waitUntil:"load",timeout:30000});
     rec.checks.http200=res.status()===200;
     rec.checks.sceneLoaded=await p.locator(".scene-art").evaluate(el=>el.complete&&el.naturalWidth>0);
     rec.checks.noHorizontalOverflow=await p.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+2);
     rec.checks.threeProjects=await p.locator(".project-feature").count()===3;
     rec.checks.threePlayablePages=await p.locator(".play-card").count()===3;
     rec.checks.titleCorrect=(await p.title()).includes("玖玖の小屋");
     rec.checks.heroHeadline=await p.locator("#heroTitle").isVisible();
     rec.checks.introReadable=await p.locator(".hero-lead").evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=12);
     if(device.mobile){
       await p.locator("#menuToggle").click();
       rec.checks.menuOpen=await p.locator("#mobileNav").isVisible();
       await p.locator('#mobileNav a[href="#play"]').click();
       rec.checks.menuCloses=await p.locator("#mobileNav").isHidden();
       await p.locator("#top").scrollIntoViewIfNeeded();
     }
     // Walk the page like a real visitor so entrance animations have fired.
     const fullHeight=await p.evaluate(()=>document.documentElement.scrollHeight);
     for(let y=0;y<=fullHeight;y+=Math.max(350,Math.floor(device.height*.8))){
       await p.evaluate(pos=>window.scrollTo(0,pos),y);
       await p.waitForTimeout(85);
     }
     await p.evaluate(()=>window.scrollTo(0,0));
     await p.waitForTimeout(950);
     await p.screenshot({path:"qa-illustrated/"+device.name+"-light.png",fullPage:true});
     const before=await p.locator("#noteQuote").textContent();
     await p.locator("#ideaButton").click();
     await p.waitForTimeout(180);
     rec.checks.ideaChanges=(await p.locator("#noteQuote").textContent())!==before;
     await p.locator("#themeToggle").click();
     rec.checks.darkMode=await p.locator("body").getAttribute("data-theme")==="dark";
     await p.locator("#top").scrollIntoViewIfNeeded();
     await p.waitForTimeout(450);
     await p.screenshot({path:"qa-illustrated/"+device.name+"-dark.png",fullPage:false});
   }catch(e){rec.errors.push(e.message);try{await p.screenshot({path:"qa-illustrated/"+device.name+"-fail.png",fullPage:true})}catch{}}
   rec.passed=rec.errors.length===0&&Object.values(rec.checks).every(Boolean);
   summary.push(rec);console.log("RESULT",JSON.stringify(rec));
   await p.close();
 }
 await browser.close();
 fs.writeFileSync("qa-illustrated/report.json",JSON.stringify(summary,null,2));
 if(summary.some(v=>!v.passed))process.exitCode=1;
}
run().catch(e=>{console.error(e);process.exitCode=1});
