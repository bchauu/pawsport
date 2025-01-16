const { TravelItems, ItemNotes, TravelList, User } = require('../models'); 
const { emitUpdate } = require('../sockets/socket')
const {sequelize} = require('../models');
exports.addPlaceToList = async (req, res) => {
    try {
      const { travelListId, placeId, name, lat, lng, notes } = req.body;

      const defaultItems = await TravelItems.findAll({
        where: {
          subLevelName: 'default',
          travelListId: travelListId
        }
      });
      defaultItems.sort((a,b) => b.dataValues.order - a.dataValues.order);
      const order = Number(defaultItems[0].dataValues.order) + 1;
      console.log(order, 'order')
      const subLevelName = 'default';
  
      const newItem = await TravelItems.create({
        travelListId,
        name,
        lat,
        lng,
        notes,
        placeId, 
        order,
        subLevelName
      });

      //start here call listItemEvents to trigger the change
      if (newItem) {
        emitUpdate('updateListItems', newItem, 'addItem');
      }
  
      res.status(201).json({ message: 'Successfully added item to list', item: newItem });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "Place already exists in this list." });   
      }
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
  const {travelListId, placeId, } = req.body;
  const { sequelize } = require('../models'); // Import Sequelize instance
  console.log(placeId, 'itemId in delete from places')
  console.log(req.body, 'req.body')
  const transaction = await sequelize.transaction();
  try {

    //find first
    const deleteItem = await TravelItems.findOne({
      where: {
        place_id: placeId,
        travel_list_id: travelListId,
      },
      transaction, // Use transaction if necessary
    });


    if (!deleteItem) {
      // Rollback the transaction and return a 404
      await transaction.rollback();
      return res.status(404).json({ message: 'Item not found or already deleted.' });
    }
    
    if (deleteItem) {
      await ItemNotes.destroy({
        where: {
          travel_item_id: deleteItem.id,
        },
        transaction, // Use the same transaction
      });
    
      // Proceed to delete the travel item if necessary
      await TravelItems.destroy({
        where: {
          id: deleteItem.id,
        },
        transaction,
      });
    }

    // Step 3: Delete the travel item within the transaction
    await TravelItems.destroy({
      where: {
        id: deleteItem.id,
        travel_list_id: travelListId,
      },
      transaction, // Pass the transaction
    });

    // Commit the transaction
    await transaction.commit();

    console.log(deleteItem, 'item to be passed to emit')

    emitUpdate('updateListItems', deleteItem, 'deleteItem');

    res.status(200).json({ message: 'Item and associated notes deleted successfully.' });

  } catch (error) {
    // Rollback the transaction in case of error
    if (transaction) await transaction.rollback();
    console.error('Error deleting item or notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

exports.addNote = async (req, res) => {
  const {travelListId, itemId, placeId, note, category} = req.body;
  const {userId} = req.user

  try {

    if (userId) {
      let travelItem;
      if (!itemId) {
        console.log('added without id and only placeId')

        travelItem = await TravelItems.findOne({ 
          where: 
            { 
              place_id: placeId,
              travel_list_id: travelListId,
            }
        })

      } else {
        travelItem = await TravelItems.findOne({ 
          where: 
            { 
              id: itemId, 
              travel_list_id: travelListId
            }
        })
      }

      // const 

        let newNote;

      if (travelItem) {
          newNote = await ItemNotes.create({
            travelItemId: travelItem.id,
            notes: note, 
            userId: userId, 
            category
          })
      }

      if (newNote) {
        console.log(newNote.dataValues, 'newNotes')
        emitUpdate('updateNotes', newNote.dataValues, 'addNote');
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

exports.moveUpOrder = async (req, res) => {
  const {currentTrip, tripToSwap} = req.body;

  try {
    await sequelize.transaction(async (transaction) => {
      await sequelize.query(
        'SELECT * FROM travel_item WHERE id IN (:currentId, :swapId) FOR UPDATE',
        { replacements: { currentId: currentTrip.id, swapId: tripToSwap.id }, transaction }
      );
    
      await TravelItems.update(
        { order: currentTrip.value },
        { where: { id: currentTrip.id }, transaction }
      );
    
      await TravelItems.update(
        { order: tripToSwap.value },
        { where: { id: tripToSwap.id }, transaction }
      );
    });

    res.status(200).json({message: 'successfully swapped order of items'})

  } catch (error) {
    console.log(error, 'error in updating order')
    res.status(500).json({message: 'error in committing changes'})
  }
}

exports.changeSubLevel = async (req, res) => {
  const { movedTripItem,  shiftedTripItems} = req.body;

  const itemKeys = Object.keys(shiftedTripItems);

  try {
    await sequelize.transaction(async (transaction) => {
      // Lock the rows involved for the transaction
      const lockRows = await sequelize.query(
        'SELECT * FROM travel_item WHERE id IN (:ids) FOR UPDATE',
        {
          replacements: { ids: [movedTripItem.id, ...itemKeys] }, 
          type: sequelize.QueryTypes.SELECT,  
        }
      );

      console.log(lockRows, 'Rows locked for update');

      // Update item to be moved to new subLevel
      const updateResult = await TravelItems.update(
        { order: movedTripItem.value, subLevelName: movedTripItem.subLevel }, 
        { 
          where: { id: movedTripItem.id }, 
          transaction 
        }
      );

      console.log(updateResult, 'Update result');

      //not moving sublevel. only change order
      await Promise.all(
        itemKeys.map(async (itemId) => {
          await TravelItems.update(
            {order: shiftedTripItems[itemId].value}, 
            {
              where: {id: itemId},
              transaction
            }
          )
        })
      );
      res.status(200).json({message: 'successfully moved sublevels and shifted existing trip items'})
    });
  } catch (error) {
    console.error(error, 'Error in updating new sub level');
  }
}
  