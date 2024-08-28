const { TravelList, TravelItems } = require('../models'); // Correct way to import

exports.addCreate = async (req, res) => {
    console.log('travel list controller')
    const { name } = req.body;
    const {userId} = req.user;
    console.log(TravelList, 'here');
    console.log(req.user, 'req')
    try {
        let listName;
        listName = await TravelList?.findOne({where: {name, userId}});

        if (listName) return res.status(400).json({ message: 'travel list already exist' });


        console.log('trying controller')

        listName = await TravelList.create({ name, userId });
        res.status(201).json({ message: "Success adding new list", listName });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to register new list' });
    }
};


exports.getList = async (req, res) => {
  const {userId} = req.user;
  console.log(userId, 'getList')
  try {
    let list; 

    list = await TravelList.findAll({where: {userId}})
    console.log(list, 'fromlist')
    res.status(200).json({message: list})

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch list of user' });
  }
};

exports.getListswithPlaces = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId, 'allLists');

    const travelLists = await TravelList.findAll({
      where: { userId },
      include: [
        {
          model: TravelItems,
          as: 'items'
        }
      ]
    });

    console.log(travelLists, 'after fetching all lists');

    if (!travelLists.length) {
      return res.status(404).json({ message: 'No travel lists found for user' });
    }

    return res.status(200).json({ message: 'Successfully fetched list with items', travelLists });
  } catch (error) {
    console.error('Error fetching lists with items:', error); // Log the exact error
    res.status(500).json({ error: error.message || 'Failed to fetch list with items' }); // Send detailed error
  }
};
