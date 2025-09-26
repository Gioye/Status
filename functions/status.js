const http = require('http');

const statusCategories = {
  1: "Informational",
  2: "Success",
  3: "Redirection",
  4: "Client Error",
  5: "Server Error"
};

exports.handler = async (event) => {
  const query = event.queryStringParameters || {};
  let code = query.code;
  const nojson = 'nojson' in query;

  if (typeof code === 'undefined') {
    code = 200;
  }

  const parsedCode = parseInt(code, 10);

  if (isNaN(parsedCode)) {
    if (nojson) {
      return {
        statusCode: 500,
        body: '',
        headers: {}
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        name: http.STATUS_CODES[500],
        category: statusCategories[5]
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const name = http.STATUS_CODES[parsedCode];

  if (!name) {
    if (nojson) {
      return {
        statusCode: 501,
        body: '',
        headers: {}
      };
    }
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: 501,
        name: http.STATUS_CODES[501],
        category: statusCategories[5]
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  if (nojson) {
    return {
      statusCode: parsedCode,
      body: '',
      headers: {}
    };
  }

  const category = statusCategories[Math.floor(parsedCode / 100)] || "Unknown";

  return {
    statusCode: parsedCode,
    body: JSON.stringify({
      code: parsedCode,
      name,
      category
    }),
    headers: { 'Content-Type': 'application/json' }
  };
};
