import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import EyeIcon from 'react-icons/lib/fa/eye';
import FireIcon from 'react-icons/lib/io/fireball';

import ChannelOccupancy from '../src';

const pubnub = {
  subscribe: jest.fn(),
  addListener: jest.fn(),
  unsubscribe: jest.fn(),
};

const minOccupancy = 1;

const props = { pubnub, channel: 'test', minOccupancy };
const instance = new ChannelOccupancy(props);
afterEach(() => {
  jest.clearAllMocks();
});

describe('#constructor', () => {
  test('should set the channelOccupancy to minOccupancy', () => {
    expect(instance.state.channelOccupancy).toEqual(minOccupancy);
  });
});

describe('#componentWillMount', () => {
  test('should subscribe to the channel, with presence', () => {
    instance.componentWillMount();
    expect(pubnub.subscribe).toHaveBeenCalledWith({
      channels: [props.channel],
      withPresence: true,
    });
  });

  test('should add a presence listener', () => {
    instance.componentWillMount();
    expect(pubnub.addListener).toHaveBeenCalledWith({
      presence: instance.onPresence,
    });
  });
});

describe('#componentWillUnmount', () => {
  test('should unsubscribe from the channel', () => {
    instance.componentWillUnmount();
    expect(pubnub.unsubscribe).toHaveBeenCalledWith({
      channels: [props.channel],
    });
  });
});

describe('#onPresence', () => {
  test('should set the event occupancy on the channelOccupancy state', () => {
    jest.spyOn(instance, 'setState').mockImplementationOnce((s) => { instance.state = s; });
    instance.onPresence({ occupancy: 20 });
    expect(instance.setState).toHaveBeenCalledWith({
      channelOccupancy: 20,
    });
  });

  test('should set the channelOccupancy to minOccupancy if the occupancy received is lower', () => {
    jest.spyOn(instance, 'setState').mockImplementationOnce((s) => { instance.state = s; });
    instance.onPresence({ occupancy: 0 });
    expect(instance.setState).toHaveBeenCalledWith({
      channelOccupancy: minOccupancy,
    });
  });
});

describe('#getOccupancyText', () => {
  test('should return the same occupancy in string if the occupancy is less than a hundred', () => {
    const result = instance.getOccupancyText(30);
    expect(result).toEqual('30');
  });

  test('should return 100+ if the occupancy is 100 or more than 100', () => {
    const result = instance.getOccupancyText(100);
    const result2 = instance.getOccupancyText(120);
    expect(result).toEqual('100+');
    expect(result2).toEqual('100+');
  });
});

describe('#getOcuppancyIcon', () => {
  test('should return the EyeIcon if occupancy is less than 50', () => {
    const call1 = instance.getOcuppancyIcon(1);
    expect(call1).toEqual(<EyeIcon />);

    const call2 = instance.getOcuppancyIcon(49);
    expect(call2).toEqual(<EyeIcon />);
  });

  test('should return the FireIcon if occupancy is more than 50', () => {
    const call1 = instance.getOcuppancyIcon(50);
    expect(call1).toEqual(<FireIcon />);

    const call2 = instance.getOcuppancyIcon(100);
    expect(call2).toEqual(<FireIcon />);
  });
});

describe('#render', () => {
  test('should match the snapshot', () => {
    const instance2 = mount(<ChannelOccupancy channel="test" pubnub={pubnub} />);
    expect(toJSON(instance2)).toMatchSnapshot();
  });
});

