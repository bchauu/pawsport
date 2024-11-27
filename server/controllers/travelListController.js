const { TravelList, TravelItems, ListPermission, ItemNotes, TravelListSubLevels } = require('../models'); // Correct way to import

exports.addCreate = async (req, res) => {
    const { name } = req.body;
    const {userId} = req.user;
    try {
        let listName;
        listName = await TravelList?.findOne({where: {name, userId}});

        if (listName) return res.status(400).json({ message: 'travel list already exist' });

        listName = await TravelList.create({ name, userId });
        res.status(201).json({ message: "Success adding new list", listName });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register new list' });
    }
};


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

  const {id} = req.body;

  try {
    const deleteItem = await TravelListSubLevels.findOne({
      where: {
        id: id,
      }
    })

    console.log(deleteItem, 'deleteItem')
  
    if (deleteItem) {
        await TravelListSubLevels.destroy({
          where: {
            id: id, 
          }
        })

        res.status(200).json({ message: 'removed sublevel from list' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items for list' });
  }
}
