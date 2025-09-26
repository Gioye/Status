const http = require('http');

exports.handler = async (event) => {
  const query = event.queryStringParameters;
  let code = query.code;

  // Default to 200 if no code is provided
  if (typeof code === 'undefined') {
    code = 200;
  }

  // Parse code to integer
  const parsedCode = parseInt(code, 10);

  // If parsing fails or not a valid number
  if (isNaN(parsedCode)) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        name: http.STATUS_CODES[500]
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const statusName = http.STATUS_CODES[parsedCode];

  // If the status code is not recognized by Node.js
  if (!statusName) {
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: 501,
        name: http.STATUS_CODES[501]
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // Return the actual status code with name only
  return {
    statusCode: parsedCode,
    body: JSON.stringify({
      code: parsedCode,
      name: statusName
    }),
    headers: { 'Content-Type': 'application/json' }
  };
};
