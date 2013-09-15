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
        model: 'User' // This does not work yet ... switch to manual entering of ids (no relational checking)
    },
    room: {
        model: 'Room'
    }
    
  }

};
