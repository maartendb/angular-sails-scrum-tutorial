module.exports = {
  schema: true,
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    assignee: {
      type: 'string',
      required: false
    },
    owner:{
      model: 'item'
    }
  }
};
