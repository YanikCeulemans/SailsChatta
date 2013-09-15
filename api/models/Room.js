/**
 * Room
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
      name: {
          type: 'string',
          required: true
      },
      users: {
          collection: 'User'
      },
      messages: 'array'
    
  }

};
