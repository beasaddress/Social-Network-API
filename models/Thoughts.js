const {Schema, model } = require('mongoose');
const Reactions = require('./Reactions');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => {
                return timestamp.toISOString();
            },
        },
        username: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        reactions: [Reactions],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
          },
          id: false,  
    }
);
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thoughts = model('thoughts', thoughtSchema);
module.exports = Thoughts;