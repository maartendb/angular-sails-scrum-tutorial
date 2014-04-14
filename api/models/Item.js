module.exports = {
  schema: true,
  attributes: {
    role: {
      type: 'string',
      required: true
    },
    feature: {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
      defaultsTo: ''
    },
    tasks:{
      collection: 'task',
      via: 'owner'
    }
  }
};
