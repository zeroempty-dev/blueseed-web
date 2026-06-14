import React, { useEffect, useRef } from 'react';

const COLORS = ['#E8DCC8','#C9B99A','#A89070','#D4C5A9','#F4EEE4'];

class Block {
  constructor(W, H) { this.W = W; this.H = H; this.init(true); }
  init(rand) {
    this.x  = rand ? Math.random() * this.W : (Math.random() > 0.5 ? -60 : this.W + 60);
    this.y  = rand ? Math.random() * this.H : Math.random() * this.H;
    this.w  = 30 + Math.random() * 100;
    this.h  = 30 + Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.alpha = 0.08 + Math.random() * 0.18;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rot = Math.random() * Math.PI * 0.5;
    this.rv  = (Math.random() - 0.5) * 0.003;
    this.circle = Math.random() > 0.6;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    if (this.circle) {
      ctx.beginPath(); ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    }
    ctx.restore();
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.rot += this.rv;
    if (this.x < -120 || this.x > this.W + 120 || this.y < -120 || this.y > this.H + 120) {
      this.init(false);
    }
  }
}

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let blocks = [];

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      blocks = Array.from({ length: 18 }, () => new Block(canvas.width, canvas.height));
    }
    resize();
    window.addEventListener('resize', resize);

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blocks.forEach(b => { b.update(); b.draw(ctx); });
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
