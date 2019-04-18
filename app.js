const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());

async function printPDF(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0"
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return pdf;
}

app.get("/pdf", function(req, res) {
  printPDF(req.query.url).then(pdf => {
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length
    });

    res.send(pdf);
  });
});

app.listen(port, function() {
  console.log(`Running on port ${port}`);
});
