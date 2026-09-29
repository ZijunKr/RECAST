(() => {
  const videos = [...document.querySelectorAll('video')];
  let active = null;
  let scheduled = false;
  const visibleArea = video => {
    const r = video.getBoundingClientRect();
    const height = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 70));
    const width = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
    const fraction = height / Math.min(r.height, Math.max(1, innerHeight - 70));
    return fraction >= 0.35 ? width * height : 0;
  };
  const playMuted = video => {
    video.muted = true;
    video.play().catch(() => {}); // Native controls remain available if autoplay is blocked.
  };
  const update = () => {
    scheduled = false;
    if (document.hidden) {
      videos.forEach(video => video.pause());
      active = null;
      return;
    }
    const candidate = videos.reduce((best, video) => {
      const area = visibleArea(video);
      return area > best.area ? {video, area} : best;
    }, {video: null, area: 0}).video;
    if (candidate === active) return; // Respect a manual pause until the visible video changes.
    videos.forEach(video => { if (video !== candidate) video.pause(); });
    active = candidate;
    if (active) playMuted(active);
  };
  const schedule = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  };
  videos.forEach(video => {
    video.muted = true;
    video.addEventListener('recast:sourcechange', () => {
      if (!document.hidden && visibleArea(video)) {
        videos.forEach(other => { if (other !== video) other.pause(); });
        active = video;
        playMuted(video);
      }
    });
  });
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  document.addEventListener('visibilitychange', schedule);
  schedule();
})();
