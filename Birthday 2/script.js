// script.js - card interaction, confetti, accessibility
(function(){
  const card = document.getElementById('card');
  const closeBtn = document.getElementById('closeBtn');
  const confettiCanvas = document.getElementById('confetti-canvas');
  let isOpen = false;

  function toggleCard(openBy){
    isOpen = !isOpen;
    card.classList.toggle('open', isOpen);
    card.setAttribute('aria-pressed', String(isOpen));
    if(isOpen){
      launchConfetti();
      // move focus into the card for screen readers
      closeBtn.focus();
    } else {
      card.focus();
    }
  }

  card.addEventListener('click', (e) => {
    toggleCard('click');
  });

  card.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      toggleCard('key');
    }
    if(e.key === 'Escape' && isOpen){
      e.preventDefault();
      toggleCard('esc');
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCard();
  });

  // Simple confetti implementation
  function launchConfetti(){
    const ctx = confettiCanvas.getContext && confettiCanvas.getContext('2d');
    if(!ctx) return;

    const W = confettiCanvas.width = window.innerWidth;
    const H = confettiCanvas.height = window.innerHeight;
    const pieces = [];
    const count = Math.floor(60 + Math.random()*40);

    for(let i=0;i<count;i++){
      pieces.push({
        x: Math.random()*W,
        y: Math.random()*H - H/4,
        w: 6 + Math.random()*10,
        h: 8 + Math.random()*12,
        r: Math.random()*360,
        color: randomColor(),
        speed: 1 + Math.random()*4,
        rotSpeed: (Math.random()-0.5)*6
      });
    }

    let ticks = 0;
    function frame(){
      ctx.clearRect(0,0,W,H);
      for(const p of pieces){
        p.y += p.speed + Math.sin((ticks+p.x)/20)*0.6;
        p.x += Math.sin((ticks+p.y)/100)*0.6;
        p.r += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r*Math.PI/180);
        ctx.fillStyle = p.color;
        roundRect(ctx, -p.w/2, -p.h/2, p.w, p.h, 2);
        ctx.fill();
        ctx.restore();
      }
      ticks++;
      if(ticks < 160){
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0,0,W,H);
      }
    }
    frame();
  }
  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }
  function randomColor(){
    const palette = ['#ff9ad0','#ffd37a','#bde0ff','#b5ffd8','#ffd6e6','#9fe4ff'];
    return palette[Math.floor(Math.random()*palette.length)];
  }

  // ensure canvas resizes
  window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });

  // small accessibility: press O to open, C to close
  window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 'o' && !isOpen){
      toggleCard('keyboard-o');
    }
    if(e.key.toLowerCase() === 'c' && isOpen){
      toggleCard('keyboard-c');
    }
  });

  // initial focus

})();