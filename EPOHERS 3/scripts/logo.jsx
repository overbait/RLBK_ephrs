var root='C:/Users/APCHIHBA/Documents/ChatGPT/EPHRS_3/';app.displayDialogs=DialogModes.NO;
function place(path,name,x,y,w,h){var dd=new ActionDescriptor();dd.putPath(charIDToTypeID('null'),new File(path));executeAction(charIDToTypeID('Plc '),dd,DialogModes.NO);var l=app.activeDocument.activeLayer;l.name=name;var b=l.bounds;var s=Math.min(w/(b[2].as('px')-b[0].as('px')),h/(b[3].as('px')-b[1].as('px')))*100;l.resize(s,s,AnchorPosition.MIDDLECENTER);b=l.bounds;l.translate(x+(w-b[2].as('px')+b[0].as('px'))/2-b[0].as('px'),y+(h-b[3].as('px')+b[1].as('px'))/2-b[1].as('px'));return l;}
var d=app.documents.add(1240,1510,72,'Logo_Autumn2',NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
place(root+'assets/autumn_wreath.png','Autumn wreath - generated ink leaves',35,170,1170,1210);
place(root+'references/Logo_universal.png','Original universal shield',175,40,890,1340);
var t=d.artLayers.add();t.kind=LayerKind.TEXT;t.name='Edition 3';t.textItem.contents='3';t.textItem.font='SouthPark_Cyr';t.textItem.size=106;t.textItem.justification=Justification.CENTER;var c=new SolidColor();c.rgb.hexValue='F8E8B7';t.textItem.color=c;t.textItem.position=[620,1460];
var opt=new PhotoshopSaveOptions();opt.layers=true;d.saveAs(new File(root+'output/Logo_Autumn2.psd'),opt);d.saveAs(new File(root+'assets/Logo_Autumn2.png'),new PNGSaveOptions(),true);
'Logo assembled';
