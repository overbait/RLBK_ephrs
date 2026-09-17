var root='C:/Users/APCHIHBA/Documents/ChatGPT/EPHRS_3/';
app.displayDialogs=DialogModes.NO;
function bounds(l){var b=l.bounds;return [b[0].as('px'),b[1].as('px'),b[2].as('px'),b[3].as('px')];}
function fit(l,x,y,w,h){var b=bounds(l),s=Math.min(w/(b[2]-b[0]),h/(b[3]-b[1]))*100;l.resize(s,s,AnchorPosition.MIDDLECENTER);b=bounds(l);l.translate(x+(w-b[2]+b[0])/2-b[0],y+(h-b[3]+b[1])/2-b[1]);}
function txt(l,t,x,y,w,h,col){l.textItem.contents=t;l.name=t;l.visible=true;if(col){var c=new SolidColor();c.rgb.hexValue=col;l.textItem.color=c;}fit(l,x,y,w,h);return l;}
function save(d,n){app.activeDocument=d;var o=new PhotoshopSaveOptions();o.layers=true;d.saveAs(new File(root+'output/'+n+'.psd'),o);d.saveAs(new File(root+'output/'+n+'.png'),new PNGSaveOptions(),true);}
var b=app.documents.getByName('Bigtournamneggbanner_spring.psd').duplicate('EWC3_Registration_Banner');
app.activeDocument=b;
var g=b.layerSets.getByName('Группа 3');
txt(g.artLayers.getByName('1v1'),'REGISTRATION',95,155,850,105,'FCF4CA');
txt(g.artLayers.getByName(' ONLINE'),'NOW',155,285,710,95,'D36338');
txt(g.artLayers.getByName(' tournament '),'OPEN',155,405,710,130,'FCF4CA');
txt(g.artLayers.getByName('APRIL'),'10-25 OCTOBER',1640,180,810,125,'FCF4CA');
txt(g.artLayers.getByName('2026'),'$2,500 PRIZE POOL',1620,345,850,105,'FCF4CA');
save(b,'EWC3_Registration_Banner');
var a=app.documents.getByName('Bigtournamneggw_spring_Open.psd').duplicate('EWC3_Registration_Announcement');
app.activeDocument=a;
a.layerSets.getByName('Handbook').visible=false;
var tg=a.layerSets.getByName('Texts'),left=tg.layerSets.getByName('Text left'),right=tg.layerSets.getByName('Text right');
left.artLayers.getByName('text new').visible=false;
txt(left.artLayers.getByName('hosted by '),'REGISTRATION',85,580,545,70,'F3E0B6');
var open=left.artLayers.getByName('hosted by ').duplicate();txt(open,'OPEN',150,675,410,120,'E4A444');
right.artLayers.getByName('new').visible=false;right.artLayers.getByName('Handbook  inside').visible=false;
txt(right.artLayers.getByName('11-26'),'10-25',1350,110,460,125,'E4A444');
txt(right.artLayers.getByName('APRIL'),'OCTOBER',1310,250,540,95,'F3E0B6');
txt(right.artLayers.getByName('$2.300+'),'$2,500',1320,490,550,155,'E4A444');
save(a,'EWC3_Registration_Announcement');
'Prepared both documents';
