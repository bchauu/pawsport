
exports.textSearch = (req, res) => {
    const { payload } = req.body;
    try {
        console.log(payload);
        let url;
        //https://maps.googleapis.com/maps/api/place/textsearch/json?query=thai+food&location=13.7563,100.5018&radius=5000&type=restaurant&language=en&opennow=true&key=AIzaSyAEEHT0dHSKuklxdI-L7q8byjZnG24-Quw
        //https://maps.googleapis.com/maps/api/geocode/json?address=Sukhumvit,Bangkok&key=YOUR_API_KEY
        //nearby search --> will need coordinates
        // use nearby instead of text search 
        https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.730556,100.568417&radius=1500&type=restaurant&keyword=chicken&key=YOUR_API_KEY
    } catch (error) {
        console.log(error, 'req to google api for text search');
    }
}