const https = require("https");
// const psi = require("psi");

// (async () => {
//   // Get the PageSpeed Insights report
//   const { data } = await psi("https://www.houseoffraser.co.uk", {
//     key: "AIzaSyABSjy7YxNbQU0kdlugeFYZnpUz-cOxCJo",
//   });
//   //   console.log(data.lighthouseResult.audits["resource-summary"]);
//   console.log(
//     JSON.stringify(data.lighthouseResult.audits["resource-summary"], null, 4)
//   );

//   // Output a formatted report to the terminal
//   //   await psi.output("https://www.houseoffraser.co.uk", {
//   //     key: "AIzaSyABSjy7YxNbQU0kdlugeFYZnpUz-cOxCJo",
//   //   });
//   //   console.log("Done");
// })();

((async) => {
  const url =
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://web.dev&key=AIzaSyABSjy7YxNbQU0kdlugeFYZnpUz-cOxCJo";

  https
    .get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        data = JSON.parse(data);
        console.log(
          JSON.stringify(
            data.lighthouseResult.audits["resource-summary"],
            null,
            4
          )
        );
      });
    })
    .on("error", (err) => {
      console.log(err.message);
    });
})();
