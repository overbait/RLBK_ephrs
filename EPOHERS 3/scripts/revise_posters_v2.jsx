var root='C:/Users/APCHIHBA/Documents/ChatGPT/EPHRS_3/';app.displayDialogs=DialogModes.NO;
function box(l){var b=l.bounds;return [b[0].as('px'),b[1].as('px'),b[2].as('px'),b[3].as('px')];}
function fit(l,x,y,w,h,stretch){var b=box(l),sx=w/(b[2]-b[0])*100,sy=h/(b[3]-b[1])*100;if(!stretch)sx=sy=Math.min(sx,sy);l.resize(sx,sy,AnchorPosition.MIDDLECENTER);b=box(l);l.translate(x+(w-b[2]+b[0])/2-b[0],y+(h-b[3]+b[1])/2-b[1]);}
function place(file,name,x,y,w,h,stretch){var dd=new ActionDescriptor();dd.putPath(charIDToTypeID('null'),new File(root+'assets/'+file));executeAction(charIDToTypeID('Plc '),dd,DialogModes.NO);var l=app.activeDocument.activeLayer;l.name=name;fit(l,x,y,w,h,stretch);return l;}
function color(l,hex){var c=new SolidColor();c.rgb.hexValue=hex;l.textItem.color=c;}
function outline(l){app.activeDocument.activeLayer=l;var ref=new ActionReference();ref.putProperty(charIDToTypeID('Prpr'),stringIDToTypeID('layerEffects'));ref.putEnumerated(charIDToTypeID('Lyr '),charIDToTypeID('Ordn'),charIDToTypeID('Trgt'));var desc=executeActionGet(ref),fx=desc.hasKey(stringIDToTypeID('layerEffects'))?desc.getObjectValue(stringIDToTypeID('layerEffects')):new ActionDescriptor();var stroke=new ActionDescriptor();stroke.putBoolean(charIDToTypeID('enab'),true);stroke.putEnumerated(charIDToTypeID('Styl'),charIDToTypeID('FStl'),charIDToTypeID('OutF'));stroke.putEnumerated(charIDToTypeID('PntT'),charIDToTypeID('FrFl'),charIDToTypeID('SClr'));stroke.putEnumerated(charIDToTypeID('Md  '),charIDToTypeID('BlnM'),charIDToTypeID('Nrml'));stroke.putUnitDouble(charIDToTypeID('Opct'),charIDToTypeID('#Prc'),100);stroke.putUnitDouble(charIDToTypeID('Sz  '),charIDToTypeID('#Pxl'),2.5);var rgb=new ActionDescriptor();rgb.putDouble(charIDToTypeID('Rd  '),248);rgb.putDouble(charIDToTypeID('Grn '),232);rgb.putDouble(charIDToTypeID('Bl  '),183);stroke.putObject(charIDToTypeID('Clr '),charIDToTypeID('RGBC'),rgb);fx.putObject(charIDToTypeID('FrFX'),charIDToTypeID('FrFX'),stroke);var set=new ActionDescriptor();set.putReference(charIDToTypeID('null'),ref);set.putObject(charIDToTypeID('T   '),stringIDToTypeID('layerEffects'),fx);executeAction(charIDToTypeID('setd'),set,DialogModes.NO);}
function save(d,n){var o=new PhotoshopSaveOptions();o.layers=true;d.saveAs(new File(root+'output/'+n+'.psd'),o);d.saveAs(new File(root+'output/'+n+'.png'),new PNGSaveOptions(),true);}
var b=app.documents.getByName('EWC3_Registration_Banner.psd').duplicate('EWC3_Registration_Banner_v2');app.activeDocument=b;
b.artLayers.getByName('Krea autumn left').visible=false;b.artLayers.getByName('Krea autumn right').visible=false;b.artLayers.getByName('Logo Autumn2').visible=false;
var g=b.layerSets.getByName('Группа 3');var bg=place('autumn_panorama_v2.png','Continuous painted autumn panorama',0,-95,2556,852,true);bg.move(g,ElementPlacement.PLACEAFTER);
var logo=place('Logo_Autumn2_v2.png','Logo Autumn2 v2',988,15,580,610,false);logo.move(b,ElementPlacement.PLACEATBEGINNING);
for(var i=0;i<g.artLayers.length;i++){var t=g.artLayers[i];if(t.kind==LayerKind.TEXT&&t.visible){color(t,'292921');outline(t);}}
save(b,'EWC3_Registration_Banner_v2');
var a=app.documents.getByName('EWC3_Registration_Announcement.psd').duplicate('EWC3_Registration_Announcement_v2');app.activeDocument=a;
a.artLayers.getByName('Logo Autumn2').visible=false;a.artLayers.getByName('Original brush texture - text panels only').visible=false;a.artLayers.getByName('Original brush texture - upper panels').visible=false;
var tg=a.layerSets.getByName('Texts');var panels=a.layerSets.add();panels.name='New painted brush backings';panels.move(tg,ElementPlacement.PLACEAFTER);
function swash(n,x,y,w,h,angle){app.activeDocument=a;var l=place('brush_swash_v2.png',n,x,y,w,h,true);if(angle)l.rotate(angle,AnchorPosition.MIDDLECENTER);l.move(panels,ElementPlacement.INSIDE);}
swash('1v1 brush',90,40,530,270,4);
swash('Online tournament sweeping brush',-30,260,735,310,3);
swash('Registration open brush',-5,535,710,295,0);
swash('October dates brush',1270,55,670,330,3);
swash('Prize pool brush',1260,350,710,335,1);
var left=tg.layerSets.getByName('Text left');color(left.artLayers.getByName(' ONLINE'),'E4A444');color(left.artLayers.getByName(' tournament '),'F3E0B6');
var logo=place('Logo_Autumn2_v2.png','Logo Autumn2 v2',625,80,685,960,false);logo.move(a,ElementPlacement.PLACEATBEGINNING);
save(a,'EWC3_Registration_Announcement_v2');
'Both v2 posters saved';

