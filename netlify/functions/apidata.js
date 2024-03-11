const axios = require('axios');

exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;

  try {
    if (!url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
        body: JSON.stringify({ error: 'URL parameter is required' }),
      };
    }

    const response = await axios.get(url);
    const data = response.data;

    // Enable CORS request
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      // Enable CORS request
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
