import React from 'react';
import { render } from 'react-dom';
import PubNub from 'pubnub';

import Index from '../src/index';

const pubnub = new PubNub({
  publishKey: 'demo',
  subscribeKey: 'demo',
  ssl: true,
});

render(<p><Index channel="test-channel" pubnub={pubnub} /> visitor(s)</p>, document.getElementById('root'));
