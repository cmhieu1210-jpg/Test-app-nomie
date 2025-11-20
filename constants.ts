
import { BraceletSize, Charm } from './types';

// PHOTOREALISTIC SVG ASSETS
// Tái tạo chính xác bề mặt thép bóng của Nomination với ánh sáng phản chiếu phức tạp (Horizon light).

const STEEL_LINK_SVG = `data:image/svg+xml;utf8,%3Csvg width='200' height='160' viewBox='0 0 200 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='chrome' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23e2e8f0'/%3E%3Cstop offset='10%25' stop-color='%23f8fafc'/%3E%3Cstop offset='25%25' stop-color='%23ffffff'/%3E%3Cstop offset='45%25' stop-color='%23cbd5e1'/%3E%3Cstop offset='50%25' stop-color='%2394a3b8'/%3E%3Cstop offset='55%25' stop-color='%23cbd5e1'/%3E%3Cstop offset='75%25' stop-color='%23ffffff'/%3E%3Cstop offset='90%25' stop-color='%23f1f5f9'/%3E%3Cstop offset='100%25' stop-color='%23e2e8f0'/%3E%3C/linearGradient%3E%3Cfilter id='shadow' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeGaussianBlur in='SourceAlpha' stdDeviation='2'/%3E%3CfeOffset dx='1' dy='1' result='offsetblur'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.3'/%3E%3C/feComponentTransfer%3E%3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3C!-- Body --%3E%3Crect x='0' y='0' width='200' height='160' fill='url(%23chrome)' /%3E%3C!-- Top Rail Detail --%3E%3Crect x='0' y='0' width='200' height='12' fill='linear-gradient(to bottom, %2394a3b8, %23f8fafc)' opacity='0.8'/%3E%3Crect x='0' y='12' width='200' height='1' fill='%2364748b' opacity='0.3'/%3E%3C!-- Bottom Rail Detail --%3E%3Crect x='0' y='148' width='200' height='12' fill='linear-gradient(to top, %2394a3b8, %23f8fafc)' opacity='0.8'/%3E%3Crect x='0' y='147' width='200' height='1' fill='%2364748b' opacity='0.3'/%3E%3C!-- Side Seams (The connection gap) --%3E%3Crect x='0' y='0' width='1' height='160' fill='%23ffffff' opacity='0.6'/%3E%3Crect x='199' y='0' width='1' height='160' fill='%2364748b' opacity='0.3'/%3E%3C!-- Text --%3E%3Ctext x='100' y='85' font-family='serif' font-size='18' text-anchor='middle' fill='%2364748b' opacity='0.4' letter-spacing='1' font-weight='bold'%3ENOMINATION%3C/text%3E%3C/svg%3E`;

const GOLD_LINK_SVG = `data:image/svg+xml;utf8,%3Csvg width='200' height='160' viewBox='0 0 200 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='gold' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fef08a'/%3E%3Cstop offset='25%25' stop-color='%23fde047'/%3E%3Cstop offset='50%25' stop-color='%23eab308'/%3E%3Cstop offset='75%25' stop-color='%23fde047'/%3E%3Cstop offset='100%25' stop-color='%23fef08a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='200' height='160' fill='url(%23gold)' /%3E%3Crect x='0' y='0' width='200' height='12' fill='%23a16207' opacity='0.2'/%3E%3Crect x='0' y='148' width='200' height='12' fill='%23a16207' opacity='0.2'/%3E%3C/svg%3E`;

export const LINK_ASSETS = {
  steel: STEEL_LINK_SVG,
  gold: GOLD_LINK_SVG
};

export const SIZES: BraceletSize[] = [
  { id: 'junior', name: 'Junior', links: 15, description: '13 cm' },
  { id: 'small', name: 'Small', links: 17, description: '15 cm' },
  { id: 'medium', name: 'Medium', links: 19, description: '17 cm' },
  { id: 'large', name: 'Large', links: 21, description: '19 cm' },
  { id: 'max', name: 'Max', links: 23, description: '21 cm' },
];

// Helper to generate placeholder charm images
const getCharmImage = (text: string, bg: string = 'transparent', isGold: boolean = false) => {
    const color = isGold ? 'b45309' : '1e293b';
    // Using ui-avatars with transparent background to simulate a symbol
    return `https://ui-avatars.com/api/?name=${text}&background=${bg}&color=${color}&size=128&font-size=0.6&length=2&bold=true&rounded=false`;
}

export const CHARMS: Charm[] = [
  // Symbols
  { id: 'c1', name: 'Gold Heart', category: 'symbol', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2530/2530865.png', price: 25, isGold: true },
  { id: 'c2', name: 'Gold Star', category: 'symbol', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', price: 25, isGold: true },
  { id: 'c3', name: 'Moon', category: 'symbol', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828880.png', price: 20 },
  { id: 'c4', name: 'Sun', category: 'symbol', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828885.png', price: 25, isGold: true },
  
  // Animals
  { id: 'a1', name: 'Paw', category: 'animal', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1076/1076928.png', price: 22 },
  { id: 'a2', name: 'Butterfly', category: 'animal', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png', price: 28 },
  
  // Letters
  { id: 'l1', name: 'A', category: 'letter', imageUrl: getCharmImage('A'), price: 15 },
  { id: 'l2', name: 'B', category: 'letter', imageUrl: getCharmImage('B'), price: 15 },
  { id: 'l3', name: 'C', category: 'letter', imageUrl: getCharmImage('C'), price: 15 },
  { id: 'l4', name: 'M', category: 'letter', imageUrl: getCharmImage('M'), price: 15 },
  
  // Stones
  { id: 's1', name: 'Ruby', category: 'stone', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2530/2530932.png', price: 40 },
  
  // Flags
  { id: 'f1', name: 'Italy', category: 'flag', imageUrl: 'https://cdn-icons-png.flaticon.com/512/197/197626.png', price: 18 },
  { id: 'f2', name: 'USA', category: 'flag', imageUrl: 'https://cdn-icons-png.flaticon.com/512/197/197484.png', price: 18 },
  { id: 'f3', name: 'VN', category: 'flag', imageUrl: 'https://cdn-icons-png.flaticon.com/512/197/197473.png', price: 18 },
];
