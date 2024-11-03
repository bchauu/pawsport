const { TravelItems } = require('../models'); 

exports.addPlaceToList = async (req, res) => {
  console.log('add place')
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
  console.log('get place')
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

exports.deletePlaceFromList = async (req, res) => {
  console.log('from delete places')
  const {travelListId, itemId} = req.body;
  
  
  try {

    const deleteItem = await TravelItems.findOne({
      where: {
        id: itemId,
        travel_list_id: travelListId
      }
    })
        // matches. now --> make duplicate item but with unique id. delete one to make sure it works
          //duplicate item each time before deleting
    console.log(deleteItem, 'item to be deleted')
    console.log(travelListId, itemId, 'from clientside')
  
    if (deleteItem) {
        await TravelItems.destroy({
          where: {
            id: itemId, 
            travel_list_id: travelListId
          }
        })

        res.status(200).json({ message: 'from delete places' });
    }


  } catch (error) {
    console.log(error, 'error from delete')
    res.status(500).json({ error: 'Failed to fetch items for list' });
  }
}
  