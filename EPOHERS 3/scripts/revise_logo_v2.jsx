var root='C:/Users/APCHIHBA/Documents/ChatGPT/EPHRS_3/';app.displayDialogs=DialogModes.NO;
function maskSelection(){var ds=new ActionDescriptor();ds.putClass(charIDToTypeID('Nw  '),charIDToTypeID('Chnl'));var rr=new ActionReference();rr.putEnumerated(charIDToTypeID('Chnl'),charIDToTypeID('Chnl'),charIDToTypeID('Msk '));ds.putReference(charIDToTypeID('At  '),rr);ds.putEnumerated(charIDToTypeID('Usng'),charIDToTypeID('UsrM'),charIDToTypeID('RvlS'));executeAction(charIDToTypeID('Mk  '),ds,DialogModes.NO);}
var d=app.documents.getByName('Logo_Autumn2.psd').duplicate('Logo_Autumn2_v2');app.activeDocument=d;
d.artLayers.getByName('Edition 3').visible=false;
var digit=d.artLayers.add();digit.name='Custom 3 - hand-lettered cream';var coords=[[562,1371],[681,1362],[679,1381],[632,1409],[654,1409],[679,1421],[684,1440],[675,1460],[651,1472],[620,1478],[588,1472],[565,1457],[561,1436],[582,1433],[584,1450],[601,1460],[624,1462],[648,1455],[659,1441],[654,1428],[637,1421],[613,1424],[604,1410],[649,1383],[582,1390],[580,1400],[562,1400]];
var pts=[];for(var i=0;i<coords.length;i++){var p=new PathPointInfo();p.kind=PointKind.CORNERPOINT;p.anchor=coords[i];p.leftDirection=coords[i];p.rightDirection=coords[i];pts.push(p);}var sp=new SubPathInfo();sp.closed=true;sp.operation=ShapeOperation.SHAPEADD;sp.entireSubPath=pts;var path=d.pathItems.add('Custom numeral 3 - editable outline',[sp]);d.selection.select(coords);var cream=new SolidColor();cream.rgb.hexValue='F8E8B7';d.selection.fill(cream);d.selection.deselect();
var base=d.artLayers.getByName('Original universal shield');var inner=d.artLayers.getByName('Autumn wreath - generated ink leaves').duplicate();inner.name='Inner leaves - masked between shield and character';inner.move(base,ElementPlacement.PLACEBEFORE);inner.resize(77,73,AnchorPosition.MIDDLECENTER);inner.translate(0,42);d.activeLayer=inner;
d.selection.select([[190,670],[1055,670],[1055,1095],[190,1095]]);d.selection.feather(1);maskSelection();d.selection.deselect();
var front=base.duplicate();front.name='Protected original character and ribbon - mask';front.move(inner,ElementPlacement.PLACEBEFORE);d.activeLayer=front;
d.selection.select([[360,560],[482,512],[710,490],[874,602],[931,729],[950,823],[942,931],[913,1027],[876,1063],[751,1070],[616,1047],[459,1044],[363,1021],[284,1022],[239,958],[245,888],[278,811],[303,730],[328,666]]);
d.selection.select([[170,1060],[1070,1060],[1070,1400],[170,1400]],SelectionType.EXTEND);d.selection.feather(0.7);maskSelection();d.selection.deselect();
digit.move(d,ElementPlacement.PLACEATBEGINNING);
var opt=new PhotoshopSaveOptions();opt.layers=true;d.saveAs(new File(root+'output/Logo_Autumn2_v2.psd'),opt);d.saveAs(new File(root+'assets/Logo_Autumn2_v2.png'),new PNGSaveOptions(),true);
'Logo v2 saved';

