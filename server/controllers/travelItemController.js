const { TravelItems, ItemNotes, TravelList, User } = require('../models'); 
exports.addPlaceToList = async (req, res) => {
    try {
      const { travelListId, place_id, name, lat, lng, notes } = req.body; 
  
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
  const {travelListId, itemId} = req.body;
  
  try {
    const deleteItem = await TravelItems.findOne({
      where: {
        id: itemId,
        travel_list_id: travelListId
      }
    })
  
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
    res.status(500).json({ error: 'Failed to fetch items for list' });
  }
}

exports.addNote = async (req, res) => {
  const {travelListId, itemId, note} = req.body;
  const {userId} = req.user

  try {
    if (userId) {
      const travelItem = await TravelItems.findOne({ where: 
        { 
          id: itemId, 
          travel_list_id: travelListId
        }})

      if (travelItem) {
        console.log(itemId, 'should be 4')
          const newNote = await ItemNotes.create({
            travelItemId: itemId,
            notes: note, 
            userId: userId
          })
          console.log(newNote, 'creating')

      }

      res.status(200).json({message: 'added notes successfully'})
    }

  } catch (error) {
    console.log(error, 'error')
  }



}

exports.getNotes = async (req, res) => {
  const {travelListId} = req.query;

  try {
    const travelList = await TravelList.findOne({
      where: { id: travelListId },
      include: [
        {
          model: TravelItems,
          as: 'items', 
          include: [
            {
              model: ItemNotes, 
              as: 'notes',
              include: [
               { 
                 model: User,
                 as: 'user'
               }
              ]
            }
          ]
        }
      ]
    })

    res.status(200).json({message: 'sucessfully fetched list with notes', travelList: travelList.dataValues.items })
  } catch (error) {
    console.log(error, 'error in get notes')
  }




  
}
  