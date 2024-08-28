const { TravelItems } = require('../models'); 

exports.addPlaceToList = async (req, res) => {
    try {
      const { travelListId, place_id, name, lat, lng, notes } = req.body; 
      console.log(travelListId, 'Adding item to list');
  
      const newItem = await TravelItems.create({
        travelListId,
        name,
        lat,
        lng,
        notes,
        placeId: place_id 
      });
  
      res.status(201).json({ message: 'Successfully added item to list', item: newItem });
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ error: 'Failed to add item to list' });
    }
  };

exports.getPlace = async (req, res) => {
    try {
      const listId = req.params.listId; 
      console.log(listId, 'Fetching items for list');
  
      const items = await TravelItems.findAll({
        where: { travelListId: listId },
      });
  
      if (!items.length) {
        return res.status(404).json({ message: 'No items found for this list' });
      }
  
      res.status(200).json({ message: 'Successfully fetched items for list', items });
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items for list' });
    }
  };
  