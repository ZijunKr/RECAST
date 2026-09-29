const experimentData={"closed-explorer": [{"scene": "002", "condition": "Stationary-facing", "video": "static/recast/scenes/closed-002-stationary_facing.mp4", "poster": "static/recast/scenes/closed-002-stationary_facing.jpg", "diagram": "static/recast/scenes/motion-stationary-facing.png", "duration": 2.0}, {"scene": "002", "condition": "Oncoming", "video": "static/recast/scenes/closed-002-oncoming.mp4", "poster": "static/recast/scenes/closed-002-oncoming.jpg", "diagram": "static/recast/scenes/motion-oncoming.png", "duration": 2.0}, {"scene": "046", "condition": "Stationary-facing", "video": "static/recast/scenes/closed-046-stationary_facing.mp4", "poster": "static/recast/scenes/closed-046-stationary_facing.jpg", "diagram": "static/recast/scenes/motion-stationary-facing.png", "duration": 3.2}, {"scene": "152", "condition": "Stationary-facing", "video": "static/recast/scenes/closed-152-stationary_facing.mp4", "poster": "static/recast/scenes/closed-152-stationary_facing.jpg", "diagram": "static/recast/scenes/motion-stationary-facing.png", "duration": 3.2}, {"scene": "152", "condition": "Cut-in and stop", "video": "static/recast/scenes/closed-152-cut_in_stop.mp4", "poster": "static/recast/scenes/closed-152-cut_in_stop.jpg", "diagram": "static/recast/scenes/motion-cutin.png", "duration": 3.2}, {"scene": "162", "condition": "Stationary-facing", "video": "static/recast/scenes/closed-162-stationary_facing.mp4", "poster": "static/recast/scenes/closed-162-stationary_facing.jpg", "diagram": "static/recast/scenes/motion-stationary-facing.png", "duration": 3.2}], "render-explorer": [{"scene": "002", "condition": "Oncoming", "video": "static/recast/scenes/scene-002-streetgs.mp4", "poster": "static/recast/scenes/scene-002-streetgs.jpg", "duration": 5.0, "group": "StreetGS"}, {"scene": "002", "condition": "Oncoming", "video": "static/recast/scenes/scene-002-omnire.mp4", "poster": "static/recast/scenes/scene-002-omnire.jpg", "duration": 5.0, "group": "OmniRe"}, {"scene": "034", "condition": "Stationary facing", "video": "static/recast/scenes/scene-034-streetgs.mp4", "poster": "static/recast/scenes/scene-034-streetgs.jpg", "duration": 5.0, "group": "StreetGS"}, {"scene": "034", "condition": "Stationary facing", "video": "static/recast/scenes/scene-034-omnire.mp4", "poster": "static/recast/scenes/scene-034-omnire.jpg", "duration": 5.0, "group": "OmniRe"}, {"scene": "046", "condition": "Advancing", "video": "static/recast/scenes/scene-046-streetgs.mp4", "poster": "static/recast/scenes/scene-046-streetgs.jpg", "duration": 9.2, "group": "StreetGS"}, {"scene": "046", "condition": "Advancing", "video": "static/recast/scenes/scene-046-omnire.mp4", "poster": "static/recast/scenes/scene-046-omnire.jpg", "duration": 9.2, "group": "OmniRe"}, {"scene": "152", "condition": "Cutting in", "video": "static/recast/scenes/scene-152-streetgs.mp4", "poster": "static/recast/scenes/scene-152-streetgs.jpg", "duration": 16.1, "group": "StreetGS"}, {"scene": "152", "condition": "Cutting in", "video": "static/recast/scenes/scene-152-omnire.mp4", "poster": "static/recast/scenes/scene-152-omnire.jpg", "duration": 16.1, "group": "OmniRe"}]};
Object.entries(experimentData).forEach(([id,items])=>{
  const panel=document.getElementById(id), video=panel.querySelector('video');
  const status=panel.querySelector('.case-status');
  const dots=[...panel.querySelectorAll('[data-slide]')];
  let current=0;
  const show=index=>{
    const next=(index+items.length)%items.length;
    if(next===current)return;
    current=next;
    const item=items[current];
    video.pause();
    video.poster=item.poster;
    video.querySelector('source').src=item.video;
    video.load();
    video.dispatchEvent(new Event('recast:sourcechange'));
    panel.querySelector('.case-title').textContent=`Scene ${item.scene} · ${item.condition}${item.group ? " · "+item.group : ""}`;
    const diagram=panel.querySelector('.motion-diagram img');
    if(diagram){diagram.src=item.diagram;diagram.alt='Actor motion: '+item.condition;}
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));
    status.textContent='';
  };
  panel.querySelector('[data-direction="previous"]').addEventListener('click',()=>show(current-1));
  panel.querySelector('[data-direction="next"]').addEventListener('click',()=>show(current+1));
  dots.forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.slide))));
  panel.addEventListener('keydown',event=>{
    if(event.target.closest('video')||event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}
    if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}
  });
  video.addEventListener('play',()=>{status.textContent='';});
  video.addEventListener('error',()=>{status.textContent='This video could not be loaded. Please reload the page and try again.';});
});
