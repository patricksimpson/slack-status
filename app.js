import express from 'express';
import fetch from 'node-fetch';

const app = express();
const slackURL = 'https://slack.com';
const slackPATH = '/api/users.profile.set';

let slackStatus = [];

const getSlackStatus = (token) => {
  if (!slackStatus[token]) {
    slackStatus[token] = false;
  }
  return slackStatus[token];
}

const setStatus = (req, status) => {
  slackStatus[getToken(req)] = status;
}

const getToken = (req) => {
  return req.query.token ? req.query.token : false;
}

const slackPARAMS = (token) => `?token=${token}&profile=`

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/active', function (req, res) {
  setStatus(req, true);
  console.log('you are active');
  res.send({active: getSlackStatus(getToken(req))});
});

app.get('/inactive', function (req, res) {
  setStatus(req, false);
  console.log('you are not active');
  res.send({active: getSlackStatus(getToken(req))});
});

app.get('/ooo', async function (req, res) {
  await slacker({
    status_text:"OOO",
    status_emoji:":dark_sunglasses:"
  }, req, res);
});

app.get('/wfh', async function (req, res) {
  await slacker({
    status_text:"WFH",
    status_emoji:":house:"
  }, req, res);
});

app.get('/wfsbhq', async function (req, res) {
  await slacker({
    status_text:"WFSBHQ",
    status_emoji:":gemspark:"
  }, req, res);
});

app.get('/weekend', async function (req, res) {
  await slacker({
    status_text:"weekending",
    status_emoji:":sun_with_face:"
  }, req, res);
});

async function slacker(action, req, res) {
  const token = getToken(req);
  if (!token) {
    return res.send({fail: true});
  }
  if (getSlackStatus(token)) {
    try {
      const response = await fetch(`${slackURL}${slackPATH}${slackPARAMS(token)}${JSON.stringify(action)}`);
      const data = await response.json();
      return res.send(response);
    } catch (e) {
      console.log(e);
      return res.send({});
    }
  }
  console.log('skipping, active is false');
  return res.send({active: false});
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

export default app;
