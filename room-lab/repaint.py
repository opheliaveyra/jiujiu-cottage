"""Create original moon-garden poster and replace identifiable third-party wall poster in baked room atlases.
Original atlas from upstream source remains in .room-upstream (never redistribute as new art).
Both daylight and nighttime variants are repainted, leaving their surrounding geometry untouched.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import math, random

BASE=Path(".room-upstream/public/textures/room")
random.seed(2409)
W,H=940,1400
def col_lerp(a,b,k):
 return tuple(round(a[i]+(b[i]-a[i])*k) for i in range(3))
def font(size):
 for name in ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf","/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"]:
  if Path(name).exists():return ImageFont.truetype(name,size)
 return ImageFont.load_default()
def draw_poster():
 im=Image.new("RGB",(W,H)); pix=im.load()
 a=(43,37,79);b=(105,84,141);c=(227,190,196)
 for y in range(H):
  t=y/(H-1);base=col_lerp(a,b,min(1,t*1.55)) if t<.55 else col_lerp(b,c,(t-.55)/.45)
  for x in range(W):
   glow=math.exp(-(((x-W*.57)/(W*.7))**2+((y-H*.34)/(H*.85))**2)*2)
   pix[x,y]=tuple(min(255,int(v+glow*(9 if n==0 else 10))) for n,v in enumerate(base))
 paint=Image.new("RGBA",(W,H));d=ImageDraw.Draw(paint,"RGBA")
 # Soft moon halo, cloud bands and delicate orbital lines
 cx,cy=570,330
 for r in range(270,100,-8):
  alpha=int((270-r)/170*4+1)
  d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(239,217,247,alpha))
 d.ellipse((cx-120,cy-120,cx+120,cy+120),fill=(252,236,235,230),outline=(255,246,248,230),width=4)
 for t in range(32):
  y=280+t*19
  xx=120+int(40*math.sin(t*.48))
  d.arc((xx,y,980,y+190),187,350,fill=(250,226,255,15),width=4)
 # Architectural garden window
 d.arc((135,170,835,1200),180,360,fill=(240,203,231,80),width=13)
 d.line([(135,685),(135,1190)],fill=(248,219,236,62),width=14)
 d.line([(835,685),(835,1190)],fill=(248,219,236,62),width=14)
 d.line([(134,1130),(836,1130)],fill=(245,214,232,85),width=11)
 # Soft ground waves
 for n in range(5):
  y=1130+n*37
  pts=[]
  for x in range(-20,W+20,12):
   yy=y+14*math.sin(x/104+n*.7)
   pts.append((x,yy))
  d.line(pts,fill=(245,202,221,max(15,80-n*12)),width=max(2,8-n))
 # Star trails
 for i in range(86):
  x=random.randint(32,W-32);y=random.randint(70,1015)
  radius=random.choice([1,2,2,3,4]);alpha=random.randint(80,190)
  d.ellipse((x-radius,y-radius,x+radius,y+radius),fill=(255,240,239,alpha))
  if i%12==0:
   d.line([(x-10,y),(x+10,y)],fill=(255,239,245,120),width=2)
   d.line([(x,y-10),(x,y+10)],fill=(255,239,245,120),width=2)
 # Branches and soft petals framing corners
 branches=[[(0,260),(125,340),(215,450),(283,580)],[(W,330),(800,400),(685,500),(590,650)],[(0,780),(130,740),(225,770)]]
 for path in branches:
  d.line(path,fill=(80,71,111,185),width=13,joint="curve")
  d.line([(x+4,y+2) for x,y in path],fill=(219,190,214,72),width=3)
 def blossom(cx,cy,sz,phase=0):
  petals=7
  for j in range(petals):
   ang=(2*math.pi*j/petals)+phase
   ex=cx+int(math.cos(ang)*sz*.68);ey=cy+int(math.sin(ang)*sz*.7)
   rr=int(sz*.58)
   d.ellipse((ex-rr,ey-rr,ex+rr,ey+rr),fill=(248,213+random.randint(0,15),237,random.randint(152,224)),outline=(255,245,253,72),width=2)
  d.ellipse((cx-sz*.24,cy-sz*.24,cx+sz*.24,cy+sz*.24),fill=(248,222,166,240))
 for j in range(56):
  if j<24:x=random.randint(-30,180);y=random.randint(260,1080)
  elif j<48:x=random.randint(750,980);y=random.randint(250,1060)
  else:x=random.randint(180,780);y=random.randint(1040,1225)
  blossom(x,y,random.randint(15,36),random.random()*6.28)
 # Typography and insignia on a grounded, subtle lower panel
 d.rounded_rectangle((110,1174,830,1332),radius=32,fill=(43,35,78,158),outline=(247,214,240,116),width=3)
 title="CISTELLA"
 f=font(85)
 bbox=d.textbbox((0,0),title,font=f)
 d.text(((W-(bbox[2]-bbox[0]))/2,1201),title,font=f,fill=(255,239,245,255),stroke_width=1)
 sub="A SMALL UNIVERSE OF STORIES"
 f2=font(25);box=d.textbbox((0,0),sub,font=f2)
 d.text(((W-(box[2]-box[0]))/2,1290),sub,font=f2,fill=(232,199,226,230))
 im=Image.alpha_composite(im.convert("RGBA"),paint).convert("RGB")
 return im

original=draw_poster()
for mode in ("day","night"):
 p=BASE/mode/f"second_texture_set_{mode}.webp"
 base=Image.open(p).convert("RGB")
 # K-pop billboard occupies the first vertical panel of the second atlas.
 # Pixel bounds measured from upstream 4096px atlas, retained across daytime/nighttime bakes.
 rect=(0,125,1518,2420)
 art=original.resize((rect[2]-rect[0],rect[3]-rect[1]),Image.Resampling.LANCZOS)
 if mode=="night":
  art=ImageEnhance.Brightness(art).enhance(.58)
  overlay=Image.new("RGB",art.size,(73,47,103))
  art=Image.blend(art,overlay,.15)
 else:
  art=ImageEnhance.Brightness(art).enhance(1.10)
 # Preserve the old wall frame border; inset tiny amount to avoid seams in the UV island.
 inset=(max(1,rect[0]),rect[1]+4,rect[2]-6,rect[3]-4)
 art=art.resize((inset[2]-inset[0],inset[3]-inset[1]),Image.Resampling.LANCZOS)
 base.paste(art,(inset[0],inset[1]))
 base.save(p,format="WEBP",quality=90,method=5)
 print("REPAINTED",str(p), "region",inset,p.stat().st_size)
# Export a flat original artwork also usable as a standalone site illustration.
out=Path(".room-upstream/public/jiujiu-art")
out.mkdir(exist_ok=True)
original.save(out/"cistella-moon-garden.webp","WEBP",quality=86,method=5)
