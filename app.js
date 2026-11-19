const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let qrInstance = null;

function initQR() {
  const qrCanvas = $("#qrCanvas");
  const qrText = $("#qrText").value || "https://nusa.studio";
  const fgColor = $("#fgColor").value || "#1a1a1a";
  const bgColor = $("#bgColor").value || "#ffffff";
  const size = parseInt($("#size").value) || 300;

  if (qrInstance) {
    qrInstance.clear();
    qrInstance._src = qrText;
  } else {
    qrInstance = new QRCodeStyling({
      width: size,
      height: size,
      data: qrText,
      background: bgColor,
      foreground: fgColor,
      logo: null,
      eyePattern: "square",
      dataModule: "square",
      cornerPattern: "square",
      label: false
    });
    qrCanvas.parentNode.replaceChild(qrInstance._el, qrCanvas);
  }

  qrInstance.setData(qrText);
  qrInstance.setColors({ foreground: fgColor, background: bgColor });
  qrInstance.render();

  // Enable download
  $("#downloadBtn").onclick = () => {
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrCanvas.toDataURL("image/png");
    link.click();
  };
}

function initEvents() {
  $("#qrText").addEventListener("input", initQR);
  $("#fgColor").addEventListener("input", initQR);
  $("#bgColor").addEventListener("input", initQR);
  $("#size").addEventListener("input", () => {
    const size = parseInt($("#size").value);
    if (qrInstance) qrInstance._el.style.width = `${size}px`;
    if (qrInstance) qrInstance._el.style.height = `${size}px`;
  });
}

// Wait for QRCodeStyling CDN to load, then init
if (window.QRCodeStyling) {
  initQR();
} else {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/qrcode-styling@1.5.2/dist/qrcode-styling.min.js";
  script.onload = initQR;
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  // Set default URL to nusa.studio
  $("#qrText").value = "https://nusa.studio";
  initQR();
});