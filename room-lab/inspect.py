import json,struct,pathlib,collections,math
from PIL import Image,ImageOps,ImageDraw,ImageFont
p=pathlib.Path(".room-upstream/public")
out=pathlib.Path("audit");out.mkdir(exist_ok=True)
raw=(p/"models/Room_Portfolio.glb").read_bytes()
assert raw[:4]==b"glTF"
length,magic=struct.unpack_from("<II",raw,8)
assert magic==0x4E4F534A
g=json.loads(raw[20:20+length])
names=g.get("nodes",[])
nodes=[]
for i,n in enumerate(names):
    name=n.get("name","")
    nodes.append({"id":i,"name":name,"mesh":n.get("mesh"),"translation":n.get("translation"),"rotation":n.get("rotation"),"scale":n.get("scale"),"children":n.get("children")})
with open(out/"nodes.json","w") as f:json.dump(nodes,f,ensure_ascii=False,indent=2)
terms=["frame","poster","picture","screen","monitor","wall","desk","laptop","computer","keyboard","art","wallpaper","glass","window","paint","tv","anime","keyboard","display","image"]
filtered=[x for x in nodes if any(t in x["name"].lower() for t in terms)]
with open(out/"matching-nodes.json","w") as f:json.dump(filtered,f,ensure_ascii=False,indent=2)
materials=g.get("materials",[])
with open(out/"materials.json","w") as f:json.dump(materials,f,ensure_ascii=False,indent=2)
mesh_details=[]
for x in filtered:
    mi=x.get("mesh")
    if mi is None:continue
    mesh=g["meshes"][mi]
    mesh_details.append({"name":x["name"],"mesh_name":mesh.get("name"),"primitives":[{"material":pr.get("material"),"attributes":pr.get("attributes"),"mode":pr.get("mode",4)} for pr in mesh.get("primitives",[])]})
with open(out/"matching-meshes.json","w") as f:json.dump(mesh_details,f,ensure_ascii=False,indent=2)
for t in filtered:print("MESH",t["name"],"n",t["id"],"m",t["mesh"],"translation",t["translation"])
pics=[]
for phase in ["day","night"]:
 for i in ["first","second","third","fourth"]:
    src=p/f"textures/room/{phase}/{i}_texture_set_{phase}.webp"
    im=Image.open(src).convert("RGB")
    print("ATLAS",src.name,im.size)
    im.thumbnail((650,650))
    pics.append((f"{phase.upper()} / {i.upper()}",im.copy()))
fw=650;fh=720
board=Image.new("RGB",(fw*4,fh*2),"#f4eff4")
d=ImageDraw.Draw(board)
for index,(name,im) in enumerate(pics):
 x=(index%4)*fw;y=(index//4)*fh
 d.text((x+12,y+12),name,fill="#4c325a",stroke_width=0)
 board.paste(im,(x,y+35))
board.save(out/"atlases.jpg",quality=87,optimize=True)
print("SUMMARY",len(nodes),"nodes",len(g.get("meshes",[])),"meshes",len(materials),"materials",len(filtered),"filtered")
