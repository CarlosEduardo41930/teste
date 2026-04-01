import fs from "fs";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

async function extrairPDF(caminhoPDF) {
  const pdf = await pdfjsLib.getDocument(caminhoPDF).promise;

  let texto = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map(item => item.str);
    texto += strings.join(" ") + "\n\n";
  }

  return texto;
}

(async () => {
  const texto = await extrairPDF("./apostila.pdf");
  fs.writeFileSync("context.md", texto);
  console.log("✅ context.md criado");
})();