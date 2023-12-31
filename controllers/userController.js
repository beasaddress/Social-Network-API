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
        .populate({ path:'thoughts', select: '-__v'});
        
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
      res.json({ message: 'User and associated thoughts deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
//might not work since friend is not a model...
//trying to add a friend object id to the friends field array
//in the user model
  async addFriend(req, res) {
    try {
        
        const { userId, friendId } = req.params;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { friends: friendId } },
            { runValidators: true, new: true}
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
        //changed findOneAndRemove to FindOneandUpdate because i accidentally deleted a whole user
        const deletedFriend = req.params.friendId;
        const updatedUser = await User.findOneAndUpdate(
            {_id: req.params.userId },
            { $pull: { friends: deletedFriend } },
            { new: true }
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