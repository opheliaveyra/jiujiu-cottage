const {chromium} = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const out = path.resolve("qa");
fs.mkdirSync(out, {recursive:true});
const cases = [
  {name:"mobile",width:390,height:844,dpr:2},
  {name:"desktop",width:1440,height:900,dpr:1}
];
const report={createdAt:new Date().toISOString(),cases:[]};
async function main(){
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--no-sandbox"]});
 for(const item of cases){
  const errors=[];
  const page=await browser.newPage({viewport:{width:item.width,height:item.height},deviceScaleFactor:item.dpr,hasTouch:item.name==="mobile",isMobile:item.name==="mobile"});
  page.on("pageerror",e=>errors.push("JS: "+e.message));
  page.on("console",m=>{if(m.type()==="error")errors.push("Console: "+m.text().slice(0,180))});
  const record={device:item.name,size:[item.width,item.height],tests:{},errors};
  report.cases.push(record);
  try{
   const res=await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded",timeout:30000});
   record.tests.http200=res?.status()===200;
   record.tests.canvasPresent=await page.locator("#experience-canvas").count()===1;
   const btn=page.locator(".loading-screen-button");
   await btn.waitFor({state:"visible",timeout:10000});
   await page.waitForFunction(()=>document.querySelector(".loading-screen-button")?.textContent.includes("进入玖玖的小屋"),null,{timeout:30000});
   record.tests.glbAndTexturesLoaded=true;
   await btn.click();
   await page.locator(".loading-screen").waitFor({state:"detached",timeout:15000});
   record.tests.splashGone=true;
   record.tests.horizontalFit=await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+2);
   record.tests.canvasRendered=await page.locator("#experience-canvas").evaluate(el=>el.width>0&&el.height>0);
   await page.screenshot({path:path.join(out,item.name+"-scene.png"),fullPage:true});
   await page.locator('[data-jiu-open="work"]').click();
   record.tests.workDialog=await page.locator(".modal.work").isVisible();
   record.tests.projectNames=await page.locator(".modal.work").innerText().then(s=>["Miorune","Cistella","AI Room"].every(x=>s.includes(x)));
   record.tests.projectLinks=await page.locator(".modal.work a").count()===3;
   await page.screenshot({path:path.join(out,item.name+"-work.png")});
   await page.locator(".modal.work .modal-exit-button").click();
   await page.waitForTimeout(750);
   await page.locator('[data-jiu-open="about"]').click();
   record.tests.aboutDialog=await page.locator(".modal.about").isVisible();
   await page.locator(".modal.about .modal-exit-button").click();
   await page.waitForTimeout(750);
   await page.locator('[data-jiu-open="contact"]').click();
   record.tests.exploreDialog=await page.locator(".modal.contact").isVisible();
   record.tests.exploreLinks=await page.locator(".modal.contact a").count()>=3;
   await page.locator(".modal.contact .modal-exit-button").click();
   await page.waitForTimeout(750);
   await page.locator(".theme-toggle-button").click();
   record.tests.theme=await page.locator("body.dark-theme").count()===1;
   await page.screenshot({path:path.join(out,item.name+"-night.png")});
  }catch(e){record.fatal=String(e.message||e).slice(0,1200);try{await page.screenshot({path:path.join(out,item.name+"-failure.png")})}catch{}}
  record.ok=!record.fatal&&errors.filter(e=>e.startsWith("JS:")).length===0&&Object.values(record.tests).every(Boolean);
  console.log("SMOKE "+item.name+" "+JSON.stringify(record));
  await page.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(out,"report.json"),JSON.stringify(report,null,2));
 if(report.cases.some(x=>!x.ok))process.exitCode=1;
}
main().catch(e=>{console.error("SMOKE_FATAL",e);process.exitCode=1});
