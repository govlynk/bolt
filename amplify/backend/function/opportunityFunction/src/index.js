const axios = require('axios');

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Max-Age': '600',
};

// Error response helper
const errorResponse = (statusCode, message) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify({ error: message })
});

// Success response helper
const successResponse = (data) => ({
  statusCode: 200,
  headers: corsHeaders,
  body: JSON.stringify(data)
});

exports.handler = async (event, context) => {
  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Validate authentication
    if (!event.requestContext.authorizer) {
      return errorResponse(401, 'Unauthorized');
    }

    const samApiKey = process.env.SAM_API_KEY;
    if (!samApiKey) {
      return errorResponse(500, 'SAM API key not configured');
    }

    // Handle GET request for opportunities
    if (event.httpMethod === 'GET') {
      const { naicsCode, postedFrom, postedTo } = event.queryStringParameters || {};
      
      const response = await axios.get('https://api.sam.gov/opportunities/v2/search', {
        params: {
          api_key: samApiKey,
          naicsCode,
          postedFrom,
          postedTo,
          limit: 100
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      return successResponse(response.data);
    }

    // Handle POST request for advanced search
    if (event.httpMethod === 'POST') {
      const searchCriteria = JSON.parse(event.body);
      
      const response = await axios.post('https://api.sam.gov/opportunities/v2/search', 
        searchCriteria,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Api-Key': samApiKey
          }
        }
      );

      return successResponse(response.data);
    }

    return errorResponse(400, 'Unsupported method');

  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific error types
    if (error.response?.status === 429) {
      return errorResponse(429, 'Rate limit exceeded');
    }
    
    if (error.response?.status === 403) {
      return errorResponse(403, 'Invalid API key');
    }

    return errorResponse(500, 'Internal server error');
  }
};