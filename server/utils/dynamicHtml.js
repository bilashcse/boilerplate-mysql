const ejs = require('ejs');

async function dynamicHtml(data, htmlUrl) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      htmlUrl,
      {
        data,
      },
      (err, html) => {
        if (err) {
          reject(err.message);
        } else if (html) {
          resolve(html);
        } else {
          reject(new Error('Error Occurred on dynamic html'));
        }
      },
    );
  });
}

module.exports = {
  dynamicHtml,
};
