import fs from "node:fs";
import path from "node:path";

const upstream = path.resolve(".room-upstream");
const read = (p) => fs.readFileSync(path.join(upstream,p),"utf8");
const write = (p,c) => fs.writeFileSync(path.join(upstream,p),c);
const asset = (p) => fs.copyFileSync(path.join("room-lab",p),path.join(upstream,"src",p));
let html=read("index.html");
const modal=(kind,title,content)=>'<section class="'+kind+' modal" role="dialog" aria-label="'+title+'"><div class="modal-wrapper"><h1 class="modal-title">'+title+'</h1><div class="modal-content"><div class="modal-content-wrapper">'+content+'</div></div></div><button class="modal-exit-button" aria-label="关闭弹窗">×</button></section>\n';
const projectCard=(n,sub,desc,url)=>'<article class="jiu-project"><div class="jiu-project-label">'+sub+'</div><h2>'+n+'</h2><p>'+desc+'</p><a href="'+url+'">查看项目 ↗</a></article>';
const work=projectCard("Miorune · 米洛恩","01 / APP","以 Cleos 为基础的非官方二次开发，围绕聊天、主题与交互体验持续完善。","../projects/cleos.html")+
projectCard("Cistella","02 / WORLD","一座逐渐成形的数字小世界。聊天、人物、世界书、档案与记忆在这里相遇。","../projects/cistella.html")+
projectCard("AI Room","03 / EXPERIMENT","多个 AI 同处一个聊天室的实验，让交流不再局限于一对一窗口。","../projects/ai-room.html");
const about='<div class="jiu-story"><div class="jiu-stamp">JIUJIU / DIGITAL ATELIER</div><h2>把喜欢的事，慢慢做成世界。</h2><p>这里是玖玖の小屋。收藏代码、插画、灵感、未完成的故事，和那些偶尔突然冒出来的奇怪点子。</p><p>不急着把每件事都做成标准答案。作品会生长，小屋也会。</p><a href="../index.html">回到原版小屋 ↗</a></div>';
const contact='<div class="jiu-story"><div class="jiu-stamp">A LITTLE DETOUR</div><h2>再逛一会儿？</h2><p>你可以去纸雕小镇盖印章，制作一张小小的明信片，或者解开一封月光来信。</p><div class="jiu-links"><a href="../world.html">纸雕小镇 ↗</a><a href="../postcard.html">纸片邮局 ↗</a><a href="../secrets.html">月光解谜 ↗</a><a href="https://github.com/opheliaveyra">GitHub ↗</a></div></div>';
const splice=(start,end,content)=>{
  const a=html.indexOf(start),b=html.indexOf(end,a+start.length);
  if(a<0||b<0)throw Error("Upstream layout changed: "+start);
  html=html.slice(0,a)+content+html.slice(b);
};
splice('<div class="work modal">','<div class="about modal">',modal("work","作品档案 · My Creations",work));
splice('<div class="about modal">','<div class="contact modal">',modal("about","关于这间小屋",about));
splice('<div class="contact modal">','<div id="experience">',modal("contact","小屋的其他房间",contact));
html=html.replace('<html lang="en">','<html lang="zh-CN">')
 .replace(/<title>[^<]+<\/title>/,'<title>玖玖の小屋 · 3D Room Atelier</title>')
 .replace(/content="안녕하세요, I'm 김수아[^"]+"/g,'content="玖玖の小屋：Miorune、Cistella、AI 群聊和正在生长的数字作品。"')
 .replace('<link rel="stylesheet" href="./src/style.scss" />','<link rel="stylesheet" href="./src/style.scss" /><link rel="stylesheet" href="./src/jiujiu.css" />')
 .replace('use left/right click and mouse wheel to navigate!','鼠标拖动旋转视角 · 滚轮缩放 · 点击房间里的物品')
 .replace('use one or two fingers to navigate!','单指旋转 · 双指缩放 · 点击房间里的物品')
 .replace('<body class="light-theme">','<body class="light-theme"><div id="jiu-chrome"><header class="jiu-header"><a class="jiu-brand" href="../index.html"><span class="jiu-brand-symbol">✳</span><span>玖玖の小屋<small>JIUJIU’S LITTLE UNIVERSE</small></span></a><nav class="jiu-nav" aria-label="房间导航"><button data-jiu-open="work">作品</button><button data-jiu-open="about">关于</button><button data-jiu-open="contact">探索</button></nav></header><div class="jiu-side">ROOM / 001<br>INTERACTIVE ATELIER</div><div class="jiu-caption"><span class="jiu-dot"></span> 拖动看看这间小屋里的秘密</div><footer class="jiu-footer"><span>✦ 每件小事，都值得认真收藏</span><span>BASED ON SOOAH’S ROOM FOLIO · ANDREW WOAN</span></footer></div>')
 .replace('</body>','<script type="module" src="./src/jiujiu.js"></script></body>');
write("index.html",html);

// The original experience uses root-absolute paths for public assets.
// Its customized preview is served inside /room-preview/, so paths must be relative.
let main=read("src/main.js");
main=main.replace('import { Howl } from "howler";','import { Howl } from "./silent-audio.js";');
main=main.replace(/(["'\x60])\/(models|textures|draco|audio|images|shaders|media|video)\//g,'$1./$2/');
main=main.replaceAll("renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));","renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.35 : 1.75));");
main=main.replace("const render = (timestamp) => {","const render = (timestamp) => {\n  if (document.hidden) { window.requestAnimationFrame(render); return; }");
main=main.replace('loadingScreenButton.textContent = "Enter!";','loadingScreenButton.textContent = "进入玖玖的小屋";')
         .replace('loadingScreenButton.textContent = "~ 안녕하세요 ~";','loadingScreenButton.textContent = "欢迎光临 · 玖玖の小屋";');

main+='\n// Expose original GSAP modal actions to the custom navigation.\nwindow.jiuOpenModal = (name) => { if (modals[name] && !document.querySelector(".loading-screen")?.classList.contains("active")) showModal(modals[name]); };\n';
write("src/main.js",main);
let vite=read("vite.config.js");
vite=vite.replace('plugins: [glsl()],','base: "./",\n  plugins: [glsl()],');
write("vite.config.js",vite);
asset("jiujiu.css");asset("jiujiu.js");asset("silent-audio.js");
// Do not redistribute the original soundtrack, sound effects, personal photos or fonts.
// They are not essential to the 3D experience; use native font fallbacks.
write("src/styles/fonts.scss","/* Removed third-party fonts; use system Chinese fonts in jiujiu.css */\n");
for(const dir of ["audio","images","fonts"]){
  const p=path.join(upstream,"public",dir);
  if(fs.existsSync(p))fs.rmSync(p,{recursive:true,force:true});
}
console.log("玖玖の小屋 adaptation applied to upstream Three.js source.");
