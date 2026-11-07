/* Synthetic statistics only. No downloaded workbook is a test fixture. */
import ExcelJS from 'exceljs';
import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

function crc(bytes){let c=0xffffffff;for(const value of bytes){c^=value;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
export function zipFixture(entries){
  const locals=[],central=[];let offset=0;
  for(const item of entries){
    const name=Buffer.from(item.name),bytes=Buffer.from(item.bytes),method=item.method??8,compressed=method===0?bytes:deflateRawSync(bytes),checksum=crc(bytes);
    const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(method,8);local.writeUInt32LE(checksum,14);local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(bytes.length,22);local.writeUInt16LE(name.length,26);
    const directory=Buffer.alloc(46);directory.writeUInt32LE(0x02014b50);directory.writeUInt16LE(20,4);directory.writeUInt16LE(20,6);directory.writeUInt16LE(method,10);directory.writeUInt32LE(checksum,16);directory.writeUInt32LE(compressed.length,20);directory.writeUInt32LE(bytes.length,24);directory.writeUInt16LE(name.length,28);directory.writeUInt32LE(offset,42);
    locals.push(local,name,compressed);central.push(directory,name);offset+=local.length+name.length+compressed.length;
  }
  const end=Buffer.alloc(22),directory=Buffer.concat(central);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...locals,directory,end]);
}
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const date=new Date('2020-01-01T00:00:00Z');
const book=()=>{const w=new ExcelJS.Workbook();w.created=date;w.modified=date;return w;};
export const MONTHLY_HTML='<p>Release Date: October 23, 2026 Next Release Date: November 24, 2026</p><a href="xls/september_generator2026.xlsx">September 2026</a><!-- <a href="xls/december_generator2026.xlsx">future</a> --><a href="xls/november_generator2026.xlsx">unreleased</a>';
export const ANNUAL_HTML='<p>Current Data</p><a href="xls/eia8602025.zip">2025</a><a href="xls/eia8602024.zip">2024</a>';

export async function makeInventoryInputs({monthlyUnits='MW',annualUnits='MW',missingPlanned=false,missingGenerator=false,wrongTitle=false,reverseSheets=false,period='2026-09',publishedAt='2026-10-23',powerShift=0,omitOperatingId=null,numericGenerator=false}={}){
  const monthly=book();
  const [periodYear,periodMonth]=period.split('-').map(Number);
  const monthName=['January','February','March','April','May','June','July','August','September','October','November','December'][periodMonth-1];
  const fields=['Plant ID','Generator ID','Plant Name','Entity Name','Plant State','Status',`Nameplate Capacity (${monthlyUnits})`,'Prime Mover Code','Balancing Authority Code','Operating Year','Operating Month','Nameplate Energy Capacity (MWh)','Latitude','Longitude','Planned Operation Year','Planned Operation Month'];
  if(missingGenerator)fields[1]='Renamed identity';
  const values=[['1','PJM','PA',100,320,40,-77],['2','ERCO','TX',40,80,30,-99],['3','CISO','CA',25,100,35,-120]];
  for(const name of reverseSheets?['Planned','Operating']:['Operating','Planned']){
    if(name==='Planned'&&missingPlanned)continue;
    const s=monthly.addWorksheet(name);s.getCell('A1').value=name+' generators as of '+(wrongTitle?'Invalid':monthName)+' '+periodYear;s.getRow(3).values=fields;
    for(const [id,ba,state,mw,mwh,lat,lon] of values){
      if(name==='Operating'&&id===omitOperatingId)continue;
      const row=s.addRow(name==='Operating'?[id,numericGenerator?1:'01','Synthetic unit '+id,'Synthetic operator',state,'(OP) Operating',mw+(id==='1'?powerShift:0),'BA',ba,2024,3,mwh,lat,lon,null,null]:[String(Number(id)+3),'P1','Synthetic construction '+id,'Synthetic operator',state,'(V) Under construction',10,'BA',ba,null,null,null,lat+0.1,lon,2027,6]);
      if(name==='Operating'&&numericGenerator)row.getCell(2).numFmt='00';
    }
  }
  const storage=book(),s=storage.addWorksheet('Operable');s.getCell('A1').value='2025 annual energy storage';
  s.getRow(2).values=['Plant Code','Generator ID','Plant Name','State','Status','Technology','Prime Mover',`Nameplate Capacity (${annualUnits})`,'Nameplate Energy Capacity (MWh)',`Maximum Charge Rate (${annualUnits})`,`Maximum Discharge Rate (${annualUnits})`,'Operating Year','Operating Month'];
  for(const [id,ba,state,mw,mwh] of values)s.addRow([id,'01','Synthetic unit '+id,state,'OP','Batteries','BA',mw,mwh,id==='1'?80:mw,id==='1'?80:id==='3'?20:mw,2024,3]);
  const plant=book(),p=plant.addWorksheet('Plant');p.getCell('A1').value='2025 annual plant';p.getRow(2).values=['Plant Code','Plant Name','State','Latitude','Longitude','Balancing Authority Code'];
  for(const [id,ba,state,, ,lat,lon] of values){p.addRow([id,'Synthetic unit '+id,state,lat,lon,ba]);p.addRow([String(Number(id)+3),'Synthetic construction '+id,state,lat+0.1,lon,ba]);}
  const monthlyBytes=Buffer.from(await monthly.xlsx.writeBuffer()),sb=Buffer.from(await storage.xlsx.writeBuffer()),pb=Buffer.from(await plant.xlsx.writeBuffer());
  const annualBytes=zipFixture([{name:'3_4_Energy_Storage_Y2025.xlsx',bytes:sb},{name:'2___Plant_Y2025.xlsx',bytes:pb}]);
  return {monthlyBytes,annualBytes,
    monthly:{url:`https://www.eia.gov/electricity/data/eia860m/xls/${monthName.toLowerCase()}_generator${periodYear}.xlsx`,period,publishedAt,bytes:monthlyBytes.length,sha256:hash(monthlyBytes),etag:'"synthetic-monthly"',lastModified:'Fri, 23 Oct 2026 15:32:18 GMT'},
    annual:{url:'https://www.eia.gov/electricity/data/eia860/xls/eia8602025.zip',reportingYear:2025,bytes:annualBytes.length,sha256:hash(annualBytes),etag:'"synthetic-annual"',lastModified:'Thu, 10 Sep 2026 16:20:14 GMT'}};
}
