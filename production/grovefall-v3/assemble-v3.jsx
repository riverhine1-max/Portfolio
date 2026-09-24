export default async ({ project }) => {
  const p = await project({
    dir: '/home/user/grovefall-v3',
    size: '1280x720',
    fps: 24,
    background: '#000000'
  });

  const add = async (file, from, dur, at) => {
    const clip = await p.add(`/home/user/${file}`);
    p.cut(clip, { from, dur, at, fit: 'contain' });
  };

  let at = 0.8;
  await add('shot00-mix.mp4', 0, 8, at); at += 8;
  await add('bridge-rooftop.mp4', 0, 4, at); at += 4;
  await add('shot01-mix.mp4', 0, 12, at); at += 12;
  await add('shot02-mix.mp4', 0, 8, at); at += 8;
  await add('shot03-mix.mp4', 0, 8, at); at += 8;
  await add('shot04-mix.mp4', 0, 12, at); at += 12;
  await add('shot05-mix.mp4', 0, 12, at); at += 12;
  await add('shot06-mix.mp4', 0, 5.7, at); at += 5.7;
  await add('bridge-aftermath.mp4', 0, 4.5, at); at += 4.5;

  await add('shot07-mix.mp4', 0, 3, at); at += 3;
  await add('shot10-mix.mp4', 0, 8, at); at += 8;
  await add('shot07-mix.mp4', 4.5, 2, at); at += 2;
  await add('shot07-mix.mp4', 9, 3, at); at += 3;

  await add('bridge-temple.mp4', 0, 4, at); at += 4;
  await add('shot08-mix.mp4', 1.4, 10.6, at); at += 10.6;

  p.compose(<rect width={1280} height={720} fill="#000000"/>, { at, dur: 1, name: 'impact-silence' });
  at += 1;
  await add('shot09-mix.mp4', 0, 10, at); at += 10;
  p.compose(<rect width={1280} height={720} fill="#000000"/>, { at, dur: .6 });
  at += .6;

  p.compose(
    <frame width={1280} height={720} layout="none" background="#020303">
      <rect x={390} y={270} width={500} height={1} fill="#a96336"
        animate={[{property:'scaleX',from:0,to:1,duration:1.2,easing:'house'}]}/>
      <text x={140} y={292} width={1000} height={120} fontFamily="Montserrat"
        fontSize={78} fontWeight={700} letterSpacing={15} align="center" color="#e9e4d9"
        animate={[
          {property:'opacity',keyframes:[{at:0,value:0},{at:.65,value:1},{at:6.7,value:1},{at:7.6,value:0}]},
          {property:'offsetY',from:12,to:0,duration:1.1,easing:'ease-out'}
        ]}>GROVEFALL</text>
      <text x={270} y={433} width={740} height={32} fontFamily="Montserrat"
        fontSize={16} fontWeight={600} letterSpacing={5} align="center" color="#bd8158"
        animate={[{property:'opacity',keyframes:[{at:0,value:0},{at:1.4,value:0},{at:2.2,value:1},{at:6.7,value:1},{at:7.6,value:0}]}]}>A SAMURAI ACTION GAME CONCEPT</text>
      <text x={390} y={478} width={500} height={24} fontFamily="Montserrat"
        fontSize={11} letterSpacing={4} align="center" color="#8f9997"
        animate={[{property:'opacity',keyframes:[{at:0,value:0},{at:2.1,value:0},{at:2.8,value:1},{at:6.7,value:1},{at:7.6,value:0}]}]}>IN DEVELOPMENT</text>
    </frame>,
    { at, dur: 8, name: 'title-card' }
  );
  at += 8;
  p.compose(<rect width={1280} height={720} fill="#000000"/>, { at, dur: .5 });

  await p.frame(80, '/home/user/grovefall-v3-check.png');
  await p.render('/home/user/grovefall-v3-raw.mp4', { bitrate: 3600000 });
};
