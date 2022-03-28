import * as flsFunctions from "./modules/functions.js";

flsFunctions.isWebp();

const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

class DragScroll {
  constructor(obj) {
    this.$el = document.querySelector(obj.el);
    this.$wrap = this.$el.querySelector(obj.wrap);
    this.$items = this.$el.querySelectorAll(obj.item);
    this.init();
  }

  init() {
    this.progress = 0;
    this.speed = 0;
    this.oldX = 0;
    this.x = 0;
    this.playrate = 0;
    //
    this.bindings();
    this.events();
    this.calculate();
    this.raf();
  }

  bindings() {
    [
      "events",
      "calculate",
      "raf",
      "move",
      "raf",
      "handleTouchStart",
      "handleTouchMove",
      "handleTouchEnd",
    ].forEach((i) => {
      this[i] = this[i].bind(this);
    });
  }

  calculate() {
    this.progress = 0;
    this.wrapWidth = this.$items[0].clientWidth * this.$items.length;
    this.$wrap.style.width = `${this.wrapWidth}px`;
    this.maxScroll = this.wrapWidth - this.$el.clientWidth + 290;
  }

  handleTouchStart(e) {
    e.preventDefault();
    if (
      e.target.classList.contains("carousel--item") ||
      e.target.tagName === "SPAN" ||
      e.target.tagName === "P"
    ) {
      this.dragging = true;
      this.startX = e.clientX || e.touches[0].clientX;
      this.$el.classList.add("dragging");
    }
  }

  handleTouchMove(e) {
    if (!this.dragging) return false;
    const x = e.clientX || e.touches[0].clientX;
    this.progress += (this.startX - x) * 2.5;
    this.startX = x;
    this.move();
  }

  handleTouchEnd() {
    this.dragging = false;
    this.$el.classList.remove("dragging");
  }

  move() {
    this.progress = clamp(this.progress, 0, this.maxScroll);
  }

  events() {
    window.addEventListener("resize", this.calculate);
    //
    this.$el.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
    //
    window.addEventListener("mousedown", this.handleTouchStart);
    window.addEventListener("mousemove", this.handleTouchMove);
    window.addEventListener("mouseup", this.handleTouchEnd);
    document.body.addEventListener("mouseleave", this.handleTouchEnd);
  }

  raf() {
    // requestAnimationFrame(this.raf)
    this.x = lerp(this.x, this.progress, 0.1);
    this.playrate = this.x / this.maxScroll;
    //
    this.$wrap.style.transform = `translateX(${-this.x}px)`;
    //
    this.speed = Math.min(100, this.oldX - this.x);
    this.oldX = this.x;
    //
    this.scale = lerp(this.scale, this.speed, 0.1);
    this.$items.forEach((i) => {
      i.style.transform = `scale(${1 - Math.abs(this.speed) * 0.002})`;
      i.style.transform = `scaleX(${1 + Math.abs(this.speed) * 0.004})`;
    });
  }
}

/*--------------------
Instances
--------------------*/
const scroll = new DragScroll({
  el: ".carousel",
  wrap: ".carousel--wrap",
  item: ".carousel--item",
});

/*--------------------
One raf to rule em all
--------------------*/
const raf = () => {
  requestAnimationFrame(raf);
  scroll.raf();
};
raf();
