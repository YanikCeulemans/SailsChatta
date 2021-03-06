/**
 * Message
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

    attributes: {

        user: {
            type: 'integer',
            required: true
        },
        room: {
            type: 'integer',
            required: true
        },
        content: {
            type: 'text',
            required: true
        }

    }

};