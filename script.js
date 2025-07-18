function locomotive() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}

locomotive();

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
});

const files = (index) => {
  const basePath = "./images";
  const fileName = `male${(index + 1).toString().padStart(4, "0")}.png`;
  return `${basePath}/${fileName}`;
};

const frameCount = 300;
const images = [];
const imageSeq = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = files(i);
  images.push(img);
}

function scaleImage(img, ctx) {
  const canvas = ctx.canvas;
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShiftX = (canvas.width - img.width * ratio) / 2;
  const centerShiftY = (canvas.height - img.height * ratio) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShiftX,
    centerShiftY,
    img.width * ratio,
    img.height * ratio
  );
}

function render() {
  scaleImage(images[imageSeq.frame], context);
}

// Image animation using GSAP
gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.15,
    trigger: "#page>canvas",
    start: "top top",
    end: "600% top",
    scroller: "#main",
  },
  onUpdate: render,
});

images[0].onload = render;

// Canvas pinning
ScrollTrigger.create({
  trigger: "#page>canvas",
  pin: true,
  scroller: "#main",
  start: "top top",
  end: "600% top",
});

["#page1", "#page2", "#page3"].forEach((selector) => {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: "top top",
      end: "bottom top",
      pin: true,
      scroller: "#main",
    },
  });
});

const gitHubButton = document.getElementById("github");

gitHubButton.onclick = () => {
  window.open("https://github.com/developerMasum", "_self");
};
