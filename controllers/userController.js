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
        //might take line 77 out
        const { userId, friendId } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { friends: friendId } },
            { new: true}
        );
        
        if(!updatedUser) {
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

  async deleteFriend(req, res) {
    try {
        //might take this line 100 out
        const { userId, friendId } = req.body;
        const updatedUser = await User.findOneAndRemove(
            {_id: userId },
            { $pull: { friends: { friendId: req.params.friendId } } },
            { runValidators: true, new: true }
        )
        if(!updatedUser) {
            return res.status(404).json({ message: 'No user with this id'});
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
  },

};