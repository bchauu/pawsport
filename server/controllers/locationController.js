const axios = require('axios');

exports.suggestions = async (req, res) => {
    const { query } = req.body;
    try {
        console.log(query, 'query');

        if (!query) {
           return res.status(400).json({message: 'query is missing'})
        }
        const suggestions = await axios.get('https://api.locationiq.com/v1/autocomplete', {
          params: {
              key: process.env.LOCATION_IQ_KEY,
              q: `${query}`,
              limit: 5,       // Limit the number of results to 5
              dedupe: 1       // Remove duplicate results
          },
        });
        console.log(suggestions.data, 'from locationIQ')
      res.status(201).json({message: 'successfully retrieved suggestions', suggestions: suggestions.data})

        //to locationIQ api

    } catch (error) {
        console.log(error, 'req to google api for text search');
    }
}