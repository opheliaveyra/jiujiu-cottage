/* Original 2D screen graphics for 玖玖の小屋.
   Replaces upstream video/screen imagery. Three.js uses the canvas as a real 3D texture.
   No external media dependencies, no autoplay and no music. */
export function createRoomScreenTexture(THREE) {
  const canvas=document.createElement("canvas");
  canvas.width=1000; canvas.height=625;
  const ctx=canvas.getContext("2d");
  const cards=[
    {name:"MIORUNE",top:"01 / DIGITAL COMPANION",sub:"a small place for conversations",colors:["#242344","#80549b","#d3a1c8"],icon:"✦",tag:"CHAT · DESIGN · PLAY"},
    {name:"CISTELLA",top:"02 / STORY UNIVERSE",sub:"somewhere between stars & stories",colors:["#192742","#5a689c","#cfa4d6"],icon:"☾",tag:"WORLD · MEMORY · PEOPLE"},
    {name:"AI ROOM",top:"03 / LITTLE LABORATORY",sub:"many minds, one little room",colors:["#162c43","#477d91","#ceb4f0"],icon:"◎",tag:"MULTI AGENT · EXPERIMENT"}
  ];
  let current=0;
  const round=(x,y,w,h,r,fill,stroke=null)=>{
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);
    if(fill){ctx.fillStyle=fill;ctx.fill()}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}
  };
  function frame(){
    const o=cards[current];
    const grad=ctx.createLinearGradient(0,0,930,690);
    grad.addColorStop(0,o.colors[0]);grad.addColorStop(.5,o.colors[1]);grad.addColorStop(1,o.colors[2]);
    ctx.fillStyle=grad;ctx.fillRect(0,0,1000,625);
    // soft light clusters
    for(let i=0;i<6;i++){
      let x=[800,230,600,870,400,70][i],y=[105,480,420,450,50,140][i];
      const g=ctx.createRadialGradient(x,y,2,x,y,150+i*14);
      g.addColorStop(0,"#fceaf270");g.addColorStop(1,"#fceaf200");
      ctx.fillStyle=g;ctx.fillRect(x-220,y-220,440,440);
    }
    ctx.strokeStyle="#fff4ff31";ctx.lineWidth=2;
    for(let j=0;j<6;j++){ctx.beginPath();ctx.ellipse(770,305,130+j*35,90+j*25,-.4,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle="#fff8ff";
    for(let j=0;j<22;j++){
      const x=(j*133+37)%950,y=(j*179+91)%560;
      ctx.globalAlpha=.35+(j%4)*.1;ctx.beginPath();ctx.arc(x,y,j%3===0?3:1.8,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    round(40,36,920,553,28,"#ffffff14","#f8e4ff3c");
    ctx.font="bold 20px system-ui,sans-serif";ctx.fillStyle="#fceaf8";ctx.fillText("玖玖の小屋",78,92);
    ctx.font="16px system-ui,sans-serif";ctx.fillStyle="#fce6ffd2";ctx.fillText(o.top,78,142);
    ctx.strokeStyle="#f8e3fb60";ctx.beginPath();ctx.moveTo(78,164);ctx.lineTo(430,164);ctx.stroke();
    ctx.font="bold 80px system-ui,sans-serif";ctx.fillStyle="#ffffff";ctx.fillText(o.name,68,284);
    ctx.font="26px system-ui,sans-serif";ctx.fillStyle="#fbeaf9e7";ctx.fillText(o.sub,78,336);
    round(77,397,390,56,28,"#fff7ffd6");
    ctx.fillStyle="#51405f";ctx.font="bold 17px system-ui,sans-serif";ctx.fillText(o.tag,97,433);
    // stylised floating device card
    round(594,158,290,272,34,"#ffffff2c","#ffffff7a");
    round(619,187,240,220,22,"#221e434c","#ffffff45");
    ctx.save();ctx.translate(741,297);
    ctx.strokeStyle="#ffe6ff";ctx.lineWidth=3;
    for(let r=30;r<=80;r+=24){ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle="#fff2ff";ctx.font="bold 103px system-ui";ctx.textAlign="center";ctx.fillText(o.icon,0,33);ctx.textAlign="start";ctx.restore();
    ctx.font="15px system-ui";ctx.fillStyle="#fff3ffcb";ctx.fillText("CREATED WITH CURIOSITY",77,535);
    ctx.fillText("00024 / ATELIER",770,535);
    const texture=screenTexture;
    texture.needsUpdate=true;
  }
  const screenTexture=new THREE.CanvasTexture(canvas);
  screenTexture.colorSpace=THREE.SRGBColorSpace;
  screenTexture.flipY=false;
  screenTexture.minFilter=THREE.LinearFilter;
  screenTexture.magFilter=THREE.LinearFilter;
  frame();
  window.setInterval(()=>{if(!document.hidden){current=(current+1)%cards.length;frame()}},6500);
  return screenTexture;
}
