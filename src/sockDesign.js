export const sockTypes = ['단목', '중목', '장목', '축구', '페이크'];

export const sections = [
  { id: 'body', name: '몸체', english: 'BODY' },
  { id: 'cuff', name: '목 부분', english: 'CUFF' },
  { id: 'heel', name: '뒤꿈치', english: 'HEEL' },
  { id: 'toe', name: '발끝', english: 'TOE' },
];

export const palette = [
  ['오프화이트', '#FAF9F6'], ['차콜', '#343C3A'], ['그레이', '#A8ADAA'], ['네이비', '#283C58'],
  ['포레스트', '#315B48'], ['세이지', '#A7B9A1'], ['스카이', '#A8C9DA'], ['라벤더', '#B6A4CD'],
  ['버터', '#EEDB94'], ['오렌지', '#DA8B58'], ['로즈', '#D99B9B'], ['레드', '#BE4E48'],
];

// 원본 SVG의 발 모양을 유지하면서 양말 종류에 맞게 목 길이를 조절한다.
export function getSockGeometry(type) {
  const [top, cuff] = ({ 단목: [295, 40], 중목: [240, 55], 장목: [170, 65], 축구: [105, 85], 페이크: [330, 25] })[type] || [105, 85];
  return {
    top: top - cuff,
    body: `M125 ${top} L275 ${top} L275 ${Math.max(255, top + 5)} Q275 ${Math.max(305, top + 12)} 305 354 L330 395 Q350 430 326 460 Q308 480 275 493 L224 520 Q190 543 160 583 L117 634 Q81 678 45 679 Q13 680 9 648 Q5 617 30 583 L90 506 Q126 461 126 394 Z`,
    cuff: `M125 ${top - cuff} H275 V${top} H125 Z`,
    heel: 'M305 354 L330 395 Q350 430 326 460 Q308 480 275 493 L247 509 Q233 478 225 455 Q213 419 240 398 Q268 375 305 354 Z',
    toe: 'M30 583 Q79 575 117 634 Q81 678 45 679 Q13 680 9 648 Q5 617 30 583 Z',
    imageY: top + (354 - top) * 0.4,
  };
}
