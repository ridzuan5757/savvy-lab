const INK='#2A2230',COAT='#FFFFFF',COATS='#E6E4EE';
const BODY='M6 22C6 13.5 9.6 8 15 8S24 13.5 24 22C24 25 21 26 15 26S6 25 6 22Z';
const SHADE='M24 19.5C24 24.6 21 25.6 15 25.6C11.6 25.6 9 25.2 7.6 24.3C13.5 24.6 20.6 23.6 24 19.5Z';
const COATP='M6.25 20.2C6.1 20.9 6 21.5 6 22C6 25 9 26 15 26S24 25 24 22C24 21.5 23.9 20.9 23.75 20.2L18.4 20.2L15 24L11.6 20.2Z';
const blob=(p)=>`
  <path d="${BODY}" fill="${p.b}" stroke="${p.o}" stroke-width=".6"/>
  <path d="${SHADE}" fill="${p.s}"/>
  <ellipse cx="10.6" cy="12.4" rx="2.1" ry="1.2" fill="#fff" opacity=".75" transform="rotate(-35 10.6 12.4)"/>
  <circle cx="13.2" cy="10.6" r=".45" fill="#fff" opacity=".8"/>
  <path d="${COATP}" fill="${COAT}" stroke="${p.o}" stroke-width=".5" stroke-linejoin="round"/>
  <path d="M7 24.2C10 25.3 20 25.3 23 24.2" stroke="${COATS}" stroke-width=".6" fill="none"/>
  <path d="M11.6 20.2L13 22.6M18.4 20.2L17 22.6" stroke="${COATS}" stroke-width=".5"/>
  <circle cx="15" cy="25" r=".35" fill="${COATS}"/>
  <rect x="8.4" y="22.4" width="2.4" height="1.6" rx=".3" fill="none" stroke="${COATS}" stroke-width=".4"/>
  <rect x="9.1" y="21.3" width=".5" height="1.6" rx=".2" fill="${p.a}"/>`;
const eyes=(kind)=>kind==='happy'
  ? `<path d="M11.1 16.4Q12.2 14.8 13.3 16.4M16.7 16.4Q17.8 14.8 18.9 16.4" stroke="${INK}" stroke-width=".7" fill="none" stroke-linecap="round"/>`
  : `<ellipse cx="12.2" cy="16" rx="1.15" ry="1.45" fill="${INK}"/><ellipse cx="17.8" cy="16" rx="1.15" ry="1.45" fill="${INK}"/>
     <circle cx="11.85" cy="15.4" r=".45" fill="#fff"/><circle cx="17.45" cy="15.4" r=".45" fill="#fff"/>
     <circle cx="12.55" cy="16.6" r=".2" fill="#fff"/><circle cx="18.15" cy="16.6" r=".2" fill="#fff"/>`;
const blush=p=>`<ellipse cx="9.6" cy="18.1" rx="1.25" ry=".65" fill="${p.k}" opacity=".75"/><ellipse cx="20.4" cy="18.1" rx="1.25" ry=".65" fill="${p.k}" opacity=".75"/>`;
const MOUTH={
  smile:`<path d="M14.1 18.1Q15 19.7 15.9 18.1Z" fill="#6B2A3A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/>`,
  oh:`<ellipse cx="15" cy="18.7" rx=".6" ry=".75" fill="#6B2A3A" stroke="${INK}" stroke-width=".3"/>`,
  tongue:`<path d="M14.1 18.3Q15 18.9 15.9 18.3" stroke="${INK}" stroke-width=".45" fill="none" stroke-linecap="round"/><path d="M15.2 18.6Q15.9 18.6 15.9 19.3Q15.7 19.9 15.2 19.6Z" fill="#F27396" stroke="${INK}" stroke-width=".25"/>`,
  grin:`<path d="M13.8 18Q15 20.2 16.2 18Z" fill="#6B2A3A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/><path d="M14.4 19.1Q15 19.6 15.6 19.1" fill="#F27396"/>`,
};
const arm=(x,y,p)=>`<ellipse cx="${x}" cy="${y}" rx="1.35" ry="1.05" fill="${COAT}" stroke="${p.o}" stroke-width=".45"/>`;
const L={
 fable:{kin:'Professor Puff',name:'Fable',note:'The head of the lab. Mortarboard with a tassel that swings, and a flask of starlight that twinkles.',
  p:{b:'#FCE38A',s:'#EEC75A',o:'#9A7420',k:'#F7A38E',a:'#E3A92C'},eyes:'happy',mouth:'smile',
  head:p=>`<path d="M11.4 8.6V9.9Q15 11.1 18.6 9.9V8.6" fill="#2B2A33" stroke="${INK}" stroke-width=".35"/>
    <path d="M8.8 7.4L15 5.1L21.2 7.4L15 9.7Z" fill="#3A3946" stroke="${INK}" stroke-width=".4" stroke-linejoin="round"/>
    <g class="tassel"><path d="M15 7.4L20.4 7.4V10.4" stroke="#F5C542" stroke-width=".45" fill="none"/><rect x="19.9" y="10.2" width="1" height="1.4" rx=".3" fill="#F5C542"/></g>
    <circle cx="15" cy="7.4" r=".45" fill="#F5C542"/>`,
  prop:p=>`<path d="M24.7 16.6V18.7L22.7 23Q22.4 24.1 23.5 24.1H27.9Q29 24.1 28.7 23L26.7 18.7V16.6Z" fill="#EAF6FF" fill-opacity=".7" stroke="${INK}" stroke-width=".4" stroke-linejoin="round"/>
    <path d="M23.3 21.6H28.1L28.7 23Q29 24.1 27.9 24.1H23.5Q22.4 24.1 22.7 23Z" fill="#FFD54A"/>
    <rect x="24.4" y="16.1" width="2.6" height=".7" rx=".3" fill="#fff" stroke="${INK}" stroke-width=".35"/>
    <path class="twk" d="M27.6 12.6L28 13.7L29.1 14.1L28 14.5L27.6 15.6L27.2 14.5L26.1 14.1L27.2 13.7Z" fill="#F5C542"/>
    <path class="twk b" d="M23.6 13.2L23.9 14L24.7 14.3L23.9 14.6L23.6 15.4L23.3 14.6L22.5 14.3L23.3 14Z" fill="#FFE27A"/>
    <circle class="twk b" cx="25.8" cy="22.8" r=".35" fill="#fff"/>`,
  hand:[23.4,21.4]},
 heavy:{kin:'Dr. Lumen',name:'Heavy',note:'The investigator. Headlamp that pulses while it leans into the microscope and turns the focus knob.',
  p:{b:'#B3A6F7',s:'#8C7DE6',o:'#3B2E8A',k:'#E68FBC',a:'#6151C2'},eyes:'normal',mouth:'oh',
  head:p=>`<path d="M7.4 12.9Q15 10.3 22.6 12.9" stroke="#2B2A33" stroke-width=".9" fill="none" stroke-linecap="round"/>
    <circle class="glow" cx="15" cy="11.1" r="2.6" fill="#FFF3B0" opacity=".55"/>
    <circle cx="15" cy="11.1" r="1.3" fill="#FFE58A" stroke="${INK}" stroke-width=".4"/><circle cx="14.6" cy="10.7" r=".35" fill="#fff"/>`,
  table:p=>`<rect x="22.4" y="24.8" width="7.2" height="1.4" rx=".6" fill="#4A4A58" stroke="${INK}" stroke-width=".35"/>
    <path d="M27.8 24.8V19.2Q27.8 16.9 25.9 16.6" stroke="#4A4A58" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <rect x="22.7" y="21.3" width="4" height=".8" rx=".3" fill="#6A6A7A"/>
    <circle class="glow" cx="24.6" cy="22.8" r=".55" fill="#7FF0FF"/>
    <g transform="rotate(-22 24.4 16)"><rect x="23.5" y="13.6" width="1.8" height="5.6" rx=".4" fill="#EDEDF4" stroke="${INK}" stroke-width=".35"/><rect x="23.1" y="12.6" width="2.6" height="1.3" rx=".35" fill="#4A4A58"/></g>
    <g class="knob"><circle cx="27.6" cy="21" r=".9" fill="#9EA2B0" stroke="${INK}" stroke-width=".3"/><path d="M27.6 20.2V21.8" stroke="${INK}" stroke-width=".3"/></g>`,
  hand:[23.6,20.6],lean:true},
 careful:{kin:'Pip',name:'Careful',note:'The chemist. Goggles up, tongue out in focus, one slow drop from the pipette into the tube.',
  p:{b:'#A6EBB8',s:'#74CF8D',o:'#22703F',k:'#F7A38E',a:'#2E9E5B'},eyes:'normal',mouth:'tongue',
  head:p=>`<path d="M7.3 12.2Q15 9.6 22.7 12.2" stroke="#3A3A44" stroke-width=".8" fill="none"/>
    <circle cx="12.3" cy="11" r="1.75" fill="#BFEAFF" fill-opacity=".85" stroke="#3A3A44" stroke-width=".55"/>
    <circle cx="17.7" cy="11" r="1.75" fill="#BFEAFF" fill-opacity=".85" stroke="#3A3A44" stroke-width=".55"/>
    <path d="M11.4 10.4L12.2 9.8M16.8 10.4L17.6 9.8" stroke="#fff" stroke-width=".4" stroke-linecap="round"/>`,
  prop:p=>`<path d="M25.2 18.6V24.1Q25.2 25.5 26.5 25.5Q27.8 25.5 27.8 24.1V18.6" fill="#EAF6FF" fill-opacity=".7" stroke="${INK}" stroke-width=".4"/>
    <path class="ripple" d="M25.4 22.6H27.6V24.1Q27.6 25.2 26.5 25.2Q25.4 25.2 25.4 24.1Z" fill="#5ED48A"/>
    <path d="M24.9 18.6H28.1" stroke="${INK}" stroke-width=".45" stroke-linecap="round"/>
    <rect x="26.15" y="11.6" width=".7" height="4.2" rx=".3" fill="#EAF6FF" stroke="${INK}" stroke-width=".3"/>
    <ellipse cx="26.5" cy="10.7" rx="1" ry="1.3" fill="#F27396" stroke="${INK}" stroke-width=".35"/>
    <circle class="drop" cx="26.5" cy="16.4" r=".45" fill="#5ED48A"/>`,
  hand:[24.6,17.2]},
 medium:{kin:'Bubbles',name:'Medium',note:'The lab tech. A cowlick, and a round flask that bubbles all day.',
  p:{b:'#A9D8F8',s:'#77BAEC',o:'#1D5A8C',k:'#F7A3B6',a:'#3D8CCB'},eyes:'normal',mouth:'smile',
  head:p=>`<path d="M14.6 8.3C13.4 6.2 16.4 5 16.9 6.8C17.1 7.6 16.2 7.9 15.8 7.4" stroke="${p.o}" stroke-width=".55" fill="none" stroke-linecap="round"/>`,
  prop:p=>`<rect x="25.3" y="16.3" width="1.6" height="3.4" fill="#EAF6FF" fill-opacity=".8" stroke="${INK}" stroke-width=".4"/>
    <circle cx="26.1" cy="22.3" r="2.95" fill="#EAF6FF" fill-opacity=".75" stroke="${INK}" stroke-width=".4"/>
    <path d="M23.25 22.6A2.85 2.85 0 0 0 28.95 22.6Z" fill="#6EC6FF"/>
    <path d="M24.9 16.3H27.3" stroke="${INK}" stroke-width=".45" stroke-linecap="round"/>
    <circle class="bub" cx="25.6" cy="21.6" r=".45" fill="#BDE6FF" stroke="#3D8CCB" stroke-width=".2"/>
    <circle class="bub b" cx="26.5" cy="21.8" r=".35" fill="#BDE6FF" stroke="#3D8CCB" stroke-width=".2"/>
    <circle class="bub c" cx="26" cy="21.4" r=".55" fill="#BDE6FF" stroke="#3D8CCB" stroke-width=".2"/>
    <ellipse cx="25.2" cy="21.2" rx=".5" ry=".9" fill="#fff" opacity=".7"/>`,
  hand:[23.5,21.6]},
 light:{kin:'Zippy',name:'Light',note:'The intern. Propeller beanie that spins, and a clipboard that fills with ticks. Moves at double speed.',
  p:{b:'#FFC797',s:'#FFA463',o:'#9A4A10',k:'#F57A82',a:'#FF7A2F'},eyes:'normal',mouth:'grin',
  head:p=>`<path d="M10.6 9.6Q15 4.6 19.4 9.6Z" fill="#F04E5A" stroke="${INK}" stroke-width=".4"/>
    <path d="M15 5.3Q12.6 7 12.4 9.2L15 9.6Z" fill="#FFD23F"/><path d="M15 5.3Q17.4 7 17.6 9.2L15 9.6Z" fill="#3D8CCB"/>
    <path d="M10.6 9.6Q15 4.6 19.4 9.6Z" fill="none" stroke="${INK}" stroke-width=".4"/>
    <path d="M15 5.2V4.5" stroke="${INK}" stroke-width=".4"/>
    <g class="prop"><path d="M15 4.6Q12.4 3.6 11.8 4.6Q12.4 5.5 15 4.6Q17.6 3.6 18.2 4.6Q17.6 5.5 15 4.6Z" fill="#FFD23F" stroke="${INK}" stroke-width=".3"/></g>
    <circle cx="15" cy="4.6" r=".4" fill="#F04E5A" stroke="${INK}" stroke-width=".25"/>`,
  prop:p=>`<rect x="22.6" y="17.4" width="5.4" height="7" rx=".6" fill="#C98A4B" stroke="${INK}" stroke-width=".4"/>
    <rect x="23.2" y="18.3" width="4.2" height="5.6" rx=".2" fill="#fff"/>
    <rect x="24.3" y="16.9" width="2" height="1.1" rx=".3" fill="#9EA2B0" stroke="${INK}" stroke-width=".3"/>
    <path d="M24.9 19.6H26.9M24.9 21.2H26.9M24.9 22.8H26.9" stroke="#C9CCD6" stroke-width=".4"/>
    <path class="ck" d="M23.5 19.5L23.9 19.9L24.5 19.1" stroke="#2EAA5B" stroke-width=".45" fill="none" stroke-linecap="round"/>
    <path class="ck b" d="M23.5 21.1L23.9 21.5L24.5 20.7" stroke="#2EAA5B" stroke-width=".45" fill="none" stroke-linecap="round"/>
    <path class="ck c" d="M23.5 22.7L23.9 23.1L24.5 22.3" stroke="#2EAA5B" stroke-width=".45" fill="none" stroke-linecap="round"/>`,
  hand:[23.2,21.8]},
 explore:{kin:'Scout',name:'Explore',note:'The field researcher. Bucket hat, and a magnifier that sweeps for samples.',
  p:{b:'#9BE8DB',s:'#62CCBA',o:'#1B6B5F',k:'#F7A38E',a:'#2A9C8C'},eyes:'normal',mouth:'smile',
  head:p=>`<path d="M9 10.4Q9.6 5.6 15 5.6T21 10.4Z" fill="#D9C08A" stroke="${INK}" stroke-width=".4"/>
    <path d="M9.4 9.2Q15 8.1 20.6 9.2" stroke="#A8864A" stroke-width=".7" fill="none"/>
    <ellipse cx="15" cy="10.5" rx="8" ry="1.25" fill="#C9AE72" stroke="${INK}" stroke-width=".4"/>`,
  prop:p=>`<g class="mag"><path d="M24.4 17.1L23 19.4" stroke="#6B4A2B" stroke-width="1" stroke-linecap="round"/>
    <circle cx="26" cy="15" r="2.3" fill="#CFF2FF" fill-opacity=".6" stroke="#6B4A2B" stroke-width=".7"/>
    <path d="M25 14.2Q25.4 13.6 26.1 13.6" stroke="#fff" stroke-width=".4" fill="none" stroke-linecap="round"/></g>`,
  hand:[23.4,20.4]},
 other:{kin:'Mocha',name:'Other',note:'Everyone else. A hair bow, and a mug of coffee that steams.',
  p:{b:'#F9BFD8',s:'#EC93BB',o:'#8E2A5A',k:'#F27396',a:'#E0457A'},eyes:'happy',mouth:'smile',
  head:p=>`<path d="M9.6 9.6L7 8V11.4Z" fill="#E0457A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/>
    <path d="M9.6 9.6L12.2 8V11.4Z" fill="#E0457A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/>
    <circle cx="9.6" cy="9.7" r=".7" fill="#FF7FA6" stroke="${INK}" stroke-width=".3"/>`,
  prop:p=>`<rect x="23" y="20" width="4.4" height="4.8" rx=".8" fill="#fff" stroke="${INK}" stroke-width=".4"/>
    <path d="M27.4 21Q29.2 21 29.2 22.4Q29.2 23.7 27.4 23.7" stroke="${INK}" stroke-width=".5" fill="none"/>
    <ellipse cx="25.2" cy="20.4" rx="1.9" ry=".35" fill="#7A4A2B"/>
    <path d="M25.2 23.6C24.2 22.9 24.1 22.1 24.7 21.9C25 21.8 25.2 22.1 25.2 22.1C25.2 22.1 25.4 21.8 25.7 21.9C26.3 22.1 26.2 22.9 25.2 23.6Z" fill="#F27396"/>
    <path class="steam" d="M24.4 19.2Q23.8 18.2 24.4 17.3T24.4 15.4" stroke="#B9B6C4" stroke-width=".45" fill="none" stroke-linecap="round"/>
    <path class="steam b" d="M26 19.2Q25.4 18.2 26 17.3T26 15.4" stroke="#B9B6C4" stroke-width=".45" fill="none" stroke-linecap="round"/>`,
  hand:[23.1,21.6]},
};
// Body colours belong to the agent run, not the tier: b body, s shade, o outline, k blush, a pen.
const PAL=[
 {n:'Peach',b:'#FFC797',s:'#FFA463',o:'#9A4A10',k:'#F57A82',a:'#FF7A2F'},
 {n:'Mint',b:'#A6EBB8',s:'#74CF8D',o:'#22703F',k:'#F7A38E',a:'#2E9E5B'},
 {n:'Sky',b:'#A9D8F8',s:'#77BAEC',o:'#1D5A8C',k:'#F7A3B6',a:'#3D8CCB'},
 {n:'Lavender',b:'#C7B8FA',s:'#9F8DEB',o:'#3B2E8A',k:'#E68FBC',a:'#6151C2'},
 {n:'Butter',b:'#FCE38A',s:'#EEC75A',o:'#9A7420',k:'#F7A38E',a:'#E3A92C'},
 {n:'Bubblegum',b:'#F9BFD8',s:'#EC93BB',o:'#8E2A5A',k:'#F27396',a:'#E0457A'},
 {n:'Seafoam',b:'#9BE8DB',s:'#62CCBA',o:'#1B6B5F',k:'#F7A38E',a:'#2A9C8C'},
 {n:'Lilac',b:'#E3C4F5',s:'#C99BE6',o:'#6A2E8A',k:'#F28FB0',a:'#9A4FC9'},
 {n:'Coral',b:'#FFB3A7',s:'#F58A7A',o:'#9A2E20',k:'#F06A7A',a:'#E0503C'},
 {n:'Lime',b:'#D6F08A',s:'#B4D85A',o:'#4E6A10',k:'#F7A38E',a:'#7FA020'},
 {n:'Periwinkle',b:'#B8C8FF',s:'#8DA2F2',o:'#283E9A',k:'#F29AC0',a:'#4A64D9'},
 {n:'Cocoa',b:'#E2C2A4',s:'#C9A07C',o:'#6B4126',k:'#F59E8B',a:'#A0643A'},
];
function svg(key,scale,pal){
  const m=L[key],p=pal?PAL[pal%PAL.length]:m.p;
  const char=`${blob(p)}${eyes(m.eyes)}${blush(p)}${MOUTH[m.mouth]}${m.head(p)}${arm(6.4,21.2,p)}${m.prop?m.prop(p):''}${arm(m.hand[0],m.hand[1],p)}`;
  const inner=m.lean?`<g class="lean"><g class="sq">${char}</g></g>`:`<g class="sq">${char}</g>`;
  return `<svg width="${30*scale}" height="${28*scale}" viewBox="0 0 30 28"><g class="c-${key} run"><ellipse class="sh" cx="15" cy="26.4" rx="8.5" ry="1.1" fill="#000" opacity=".15"/>${m.table?m.table(p):''}${inner}</g></svg>`;
}
