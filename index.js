import express from "express";
import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import path, { dirname } from "path";

const app = express();
const endUrl = "https://www.theprint.in/";
const PORT = 8000;

const filePath = "./data/articles";
console.log();
axios({
  url: endUrl,
})
  .then((response) => {
    const html = response.data;

    const $ = cheerio.load(html);
    const articles = [];
    $(".td-module-title", html).each(function () {
      const title = $(this).text();

      const url = $(this).find("a").attr("href");

      articles.push({ title, url });
    });

    // const data = JSON.stringify(articles);
    // fs.writeFileSync(filePath, data, "utf-8", (err) => {
    //   if (err) throw err;
    //   console.log("File has been written");
    // });
    const file = fs.createWriteStream(filePath);
    file.on("error", (error) => console.log(error));
    articles.length > 0 &&
      articles.forEach(function (ar) {
        file.write(
          "{" +
            "\r\n" +
            "title: " +
            ar.title +
            "," +
            "\r\n" +
            "url: " +
            ar.url +
            "\r\n" +
            "}," +
            "\r\n"
        );
      });
    file.on("finish", () => console.log("finished writing file"));
    file.end();
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
