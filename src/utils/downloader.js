const svgHead =
  '<?xml version="1.0" encoding="utf-8"?>\n ' +
  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n';

const MIME = { jpg: "image/jpeg", png: "image/png" };

export function saveSvg(value, content) {
  let htmlContent = [svgHead + content];
  let bl = new Blob(htmlContent, { type: "image/svg+xml" });
  let a = document.createElement("a");
  let filename = "QRcode_" + value + ".svg";

  a.href = URL.createObjectURL(bl);
  a.download = filename;
  a.hidden = true;
  a.click();
}

export function saveImg(
  value,
  content,
  width,
  height,
  type,
  onlyCreate = false
) {
  if (!MIME[type]) throw "Error image type";

  // Finish creating downloadable data
  let filename = "QRcode_" + value + "." + type;
  const wrap = document.createElement("div");
  wrap.innerHTML = content;

  const $svg = wrap.firstChild;
  const $clone = $svg.cloneNode(true);

  $clone.setAttribute("width", width);
  $clone.setAttribute("height", height);

  const svgData = new XMLSerializer().serializeToString($clone);

  let canvas = document.createElement("canvas");

  // Image will be scaled to the requested size.
  // var size = data.requestedSize;
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  let ctx = canvas.getContext("2d");
  let img = document.createElement("img");
  img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.fillStyle = "white";
      if (type === "jpg") ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      // `download` attr is not well supported
      // Will result in a download popup for chrome and the
      // image opening in a new tab for others.

      let data = canvas.toDataURL(MIME[type], 0.8);

      if (!onlyCreate) {
        let a = document.createElement("a");

        a.setAttribute("href", data);
        a.setAttribute("target", "download");
        a.setAttribute("download", filename);
        a.click();
      }

      resolve(data);
    };
  });
}
