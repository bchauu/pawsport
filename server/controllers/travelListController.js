const { TravelList, TravelItems, ListPermission, ItemNotes, TravelListSubLevels } = require('../models'); // Correct way to import
const {addPlaceToList} = require('./travelItemController');
const {sequelize} = require('../models')

const createTravelList = async (name, userId) => {
  const listName = await TravelList?.findOne({where: {name, userId}});
  if (listName) {
    return 'travel list already exist';
  }

  return await TravelList.create({ name, userId });
}

exports.addCreate = async (req, res) => {
    const { name } = req.body;
    const {userId} = req.user;
    try {
        let listName;
        // listName = await TravelList?.findOne({where: {name, userId}});
        listName = await createTravelList(name, userId);

        if (listName === 'travel list already exist') return res.status(400).json({ message: 'travel list already exist' });

        // listName = await TravelList.create({ name, userId });
        res.status(201).json({ message: "Success adding new list", listName });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register new list' });
    }
};

// exports.copyItinerary = async (req, res) => {
  
//   const {userId} = req.user;
  

//   // const travelLists = await TravelList.findAll({
//   //   where: { userId },
//   //   include: [
//   //     {
//   //       model: TravelItems,
//   //       as: 'items', 
//   //     },
//   //     {
//   //       model: TravelListSubLevels, 
//   //       as: 'subLevels'
//   //     }
//   //   ]
//   // });
//       //get travelList with all items. 
//           //id of each list exist
//           //just need to send that Id here
//           //use findOne with id instead of findAll

//         //this will retrieve the list 
//         //extract listName to pass into createTravelList

//         //then once successful from listName
//           //use listName id to addPlaces to each by mapping listName    --> addPlaceToList
  
//   //step 1. findOne from travelList with listId of curatedList that needs to be copied
//   //step 2. map through and extract all info needed from each item in list after creation
//   //step 3. TravelItems.create with each of the info. 



//   let listName;
//   try {
//     listName = await createTravelList(name, userId);

//     if (listName === 'travel list already exist') return res.status(400).json({ message: 'travel list already exist' });

//     //then map through and createItem
//       // const { travelListId, placeId, name, lat, lng, notes } = req.body; 
//         //extract each of these to create
//         // try {
//         //   const { travelListId, placeId, name, lat, lng, notes } = req.body; 
      
//         //   const newItem = await TravelItems.create({
//         //     travelListId,
//         //     name,
//         //     lat,
//         //     lng,
//         //     notes,
//         //     placeId
//         //   });
      
//         //   res.status(201).json({ message: 'Successfully added item to list', item: newItem });
//         // } catch (error) {
//         //   console.error('Error adding item:', error);
//         //   res.status(500).json({ error: 'Failed to add item to list' });
//         // }
    

//   } catch (error) {
//       res.status(500).json({ error: 'Failed to register new list' });
//   }

  
// }


exports.getList = async (req, res) => {
  const {userId} = req.user;
  const test = req.user;
  console.log('before get list')
  try {
    let list; 
    console.log('before get list')

    list = await TravelList.findAll({
      where: {userId},
      include: [
        {
          model: TravelListSubLevels, 
          as: 'subLevels'
        }
      ]
  })

  console.log(list, 'check list with sublevels')
    res.status(200).json({message: list})

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch list of user' });
  }
};

exports.getSharedList = async (req, res) => {
  const {userId} = req.user;
  console.log(userId, 'getSharedList controller')

  const listPermission = await ListPermission.findAll({
    // where: { userId: userId},
    where: { userId: 5},
    include: [
      {
        model: TravelList, 
        as: 'travelList',
      }
    ]
  })

  if (listPermission.length) {
    console.log(listPermission, 'from querying listPermission')

    res.status(200).json({message: 'successfully fetched shared lists', listPermission})
  } else {
      console.log('user has no shared list')
    res.status(200).json({message: 'user has no shared list' })
  }




  
}

exports.getListswithPlaces = async (req, res) => {
  try {
    const { userId } = req.user;

    const travelLists = await TravelList.findAll({
      where: { userId },
      include: [
        {
          model: TravelItems,
          as: 'items', 
        },
        {
          model: TravelListSubLevels, 
          as: 'subLevels'
        }
      ]
    });

    // console.log(travelLists[0], 'should include sublevels')

    if (!travelLists.length) {
      return res.status(404).json({ message: 'No travel lists found for user' });
    }

    return res.status(200).json({ message: 'Successfully fetched list with items', travelLists });
  } catch (error) {
    console.error('Error fetching lists with items:', error); // Log the exact error
    res.status(500).json({ error: error.message || 'Failed to fetch list with items' }); // Send detailed error
  }
};

exports.addSubLevel = async (req, res) => {
  const {name, travelListId} = req.body
  console.log(name, travelListId, 'addSubLevel')
  try {
    const subLevels = await TravelListSubLevels.create({name, travelListId})
    res.json({message: 'added sub-level', subLevels})

  } catch (error) {
    console.log(error, 'error in creating sublevels ')
  }
}

exports.deleteSubLevel = async (req, res) => {
  console.log('deleteSubLevel')

  const {id} = req.body;

      try {
        console.log(id, 'id in remove')
        const subLevel = await TravelListSubLevels.findOne({
          attributes: ['name', 'travelListId'], // Fetch only the necessary field
          where: {id},
        });
      
        if (!subLevel) {
          throw new Error('Sub-level not found');
        }
        console.log(subLevel, 'subLevel in remove')
      
        const subLevelName = subLevel.name;
        const travelListId = subLevel.travelListId;
      

        try {
          await sequelize.transaction(async (transaction) => {
            // Delete from TravelItems
            const deleteTravelItems = await TravelItems.destroy({
              where: {
                travelListId: travelListId,
                subLevelName: subLevelName,
              },
              transaction,
            });
        
            // Delete from SubLevels
            const deleteSubLevels = await TravelListSubLevels.destroy({
              where: {
                name: subLevelName, // Adjust as per your schema
              },
              transaction,
            });
        
            console.log(`Deleted ${deleteTravelItems} items from TravelItems`);
            console.log(`Deleted ${deleteSubLevels} items from SubLevels`);
          });

          res.status(200).json({message: 'successfully removed sublevel and items within'})
        } catch (error) {
          console.error("Error in transaction:", error);
        }
      } catch (error) {
        console.error('Error:', error);
      }

}
