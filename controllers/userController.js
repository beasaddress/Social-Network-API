const { User, Thoughts } = require('../models');

module.exports = {
 
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if(!user) {
            return res.status(404).json({ message: 'No user with this ID' });
        }

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
  },
  
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      //bonus instructions
      await Thoughts.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated apps deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
//might not work since friend is not a model...
//trying to add a friend object id to the friends field array
//in the user model
  async addFriend(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId},
            { $addToSet: { friends: user._id } },
            { new: true}
        );
        
        if(!user) {
            return res.status(404).json({
                message: 'no user found'
            });
        }

        res.json('Added friend to friends list');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
  },

};