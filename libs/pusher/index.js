const Pusher = require('pusher');

const pusher = new Pusher({
  app_id: '1026471',
  key: 'c45bb17ba1ce75dfb1e3',
  secret: 'bdb5d4985e08bddea150',
  cluster: 'ap1',
});

module.exports = pusher;
