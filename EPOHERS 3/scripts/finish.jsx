var root='C:/Users/APCHIHBA/Documents/ChatGPT/EPHRS_3/';app.displayDialogs=DialogModes.NO;
function place(path,name,x,y,w,h){var dd=new ActionDescriptor();dd.putPath(charIDToTypeID('null'),new File(path));executeAction(charIDToTypeID('Plc '),dd,DialogModes.NO);var l=app.activeDocument.activeLayer;l.name=name;var b=l.bounds;var s=Math.min(w/(b[2].as('px')-b[0].as('px')),h/(b[3].as('px')-b[1].as('px')))*100;l.resize(s,s,AnchorPosition.MIDDLECENTER);b=l.bounds;l.translate(x+(w-b[2].as('px')+b[0].as('px'))/2-b[0].as('px'),y+(h-b[3].as('px')+b[1].as('px'))/2-b[1].as('px'));return l;}
function top(l,d){l.move(d,ElementPlacement.PLACEATBEGINNING);}
function save(d,n){app.activeDocument=d;d.save();d.saveAs(new File(root+'output/'+n+'.png'),new PNGSaveOptions(),true);}
var b=app.documents.getByName('EWC3_Registration_Banner.psd');app.activeDocument=b;
var g=b.layerSets.getByName('Группа 3');for(var i=0;i<b.layers.length;i++)b.layers[i].visible=false;g.visible=true;
var bg=place(root+'assets/autumn_bg_01.png','Krea autumn left',0,-35,1320,737);bg.move(g,ElementPlacement.PLACEAFTER);
bg=place(root+'assets/autumn_bg_02.png','Krea autumn right',1236,-35,1320,737);bg.move(g,ElementPlacement.PLACEAFTER);
var logo=place(root+'assets/Logo_Autumn2.png','Logo Autumn2',988,15,580,610);top(logo,b);
save(b,'EWC3_Registration_Banner');
var a=app.documents.getByName('EWC3_Registration_Announcement.psd');app.activeDocument=a;
a.layerSets.getByName('LogoSpring').visible=false;
a.layerSets.getByName('Группа 3').visible=false;
var bg=place(root+'assets/autumn_bg_02.png','Krea autumn landscape',0,0,1935,1080);bg.move(a.layerSets.getByName('Backtext'),ElementPlacement.PLACEAFTER);
var logo=place(root+'assets/Logo_Autumn2.png','Logo Autumn2',625,80,685,960);top(logo,a);
var age=place('C:/Users/APCHIHBA/Downloads/Age_of_Empires_IV_Logo.png','Age of Empires IV',90,870,510,170);top(age,a);
save(a,'EWC3_Registration_Announcement');
'Both seasonal layouts saved';
