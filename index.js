const moment = require("moment");
const Twit = require("twit");
const cron = require("node-cron");

require("dotenv").config();

const twit = new Twit({
  timeout_ms: 10 * 60 * 1000,
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_key_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

const university = [["UFG", "12/06/2021"]];

exports.handler = async () => {
  for (const [name, endOfTerm] of university) {
    const today = moment(new Date());
    let diffDays;

    if (today.isSame(moment(endOfTerm, "DD/MM/YYYY"), "day")) {
      diffDays = 0;
    } else {
      diffDays = moment(endOfTerm, "DD/MM/YYYY").diff(today, "days") + 1;
    }

    let falta = "Falta";
    if (diffDays > 1) {
      falta = falta + "m";
    }

    let dia = "dia";
    if (diffDays > 1) {
      dia = dia + "s";
    }

    let status = null;
    if (diffDays > 0) {
      status = `${falta} ${diffDays} ${dia} para o fim do semestre na ${name}! 🧑‍🎓`;
    } else if (diffDays === 0) {
      status = `Uhul! O semestre na ${name} acabou! 😄`;
    }

    if (status) {
      console.log(status);
      await new Promise((resolve) =>
        twit.post("statuses/update", { status }, resolve)
      );
    }
  }
};

cron.schedule("30 08 * * *", function () {
  console.log('Running Cron Job');
  exports.handler();
});
