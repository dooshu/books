var fs = require("fs");


const aaa = `
ÁÁÁÁÁÁÁÁÁÁ：doosho.com　1，2，3，4，5

ББББББББББ：doosho.com　

ĆĆĆĆĆĆĆĆĆĆ：doosho.com　

ĎĎĎĎĎĎĎĎĎĎ：doosho.com　

ÊÊÊÊÊÊÊÊÊÊ：doosho.com　

♀♀♀♀♀♀♀♀♀♀：doosho.com　

ĞĞĞĞĞĞĞĞĞĞ：doosho.com　

ĤĤĤĤĤĤĤĤĤĤ：doosho.com　

ĨĨĨĨĨĨĨĨĨĨ：doosho.com　

ĴĴĴĴĴĴĴĴĴĴ：doosho.com　

ЌЌЌЌЌЌЌЌЌЌ：doosho.com　

ĹĹĹĹĹĹĹĹĹĹ：doosho.com　

♂♂♂♂♂♂♂♂♂♂：doosho.com　

ŃŃŃŃŃŃŃŃŃŃ：doosho.com　

ÓÓÓÓÓÓÓÓÓÓ：doosho.com　

φφφφφφφφφφ：doosho.com　

ℚℚℚℚℚℚℚℚℚℚ：doosho.com　

ŔŔŔŔŔŔŔŔŔŔ：doosho.com　

ŚŚŚŚŚŚŚŚŚŚ：doosho.com　

ŤŤŤŤŤŤŤŤŤŤ：doosho.com　

ÚÚÚÚÚÚÚÚÚÚ：doosho.com　

≚≚≚≚≚≚≚≚≚≚：doosho.com　

ŴŴŴŴŴŴŴŴŴŴ：doosho.com　

ϰϰϰϰϰϰϰϰϰϰ：doosho.com　

ÝÝÝÝÝÝÝÝÝÝ：doosho.com　

ŹŹŹŹŹŹŹŹŹŹ：doosho.com　



`



for(i=227; i<582; i++){
    if([250, 284].includes(i))continue
    const data = fs.readFileSync(i+'.txt', 'utf8');

    [chapters, contents] = data.split('\n\n')

    fs.writeFileSync(i+'a.txt', chapters+'\n\n\n\n\n'+aaa+chapters(0, chapters.indexOf('\n'))+'\n\n\n'+contents)
}