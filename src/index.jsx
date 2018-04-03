import React from 'react';
import PropTypes from 'prop-types';
import EyeIcon from 'react-icons/lib/fa/eye';
import FireIcon from 'react-icons/lib/io/fireball';

export default class ChannelOccupancy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channelOccupancy: this.props.minOccupancy,
    };
  }

  componentWillMount() {
    this.props.pubnub.subscribe({
      channels: [this.props.channel],
      withPresence: true,
    });

    this.props.pubnub.addListener({
      presence: this.onPresence,
    });
  }

  componentWillUnmount() {
    this.props.pubnub.unsubscribe({
      channels: [this.props.channel],
    });
  }

  onPresence = (event) => {
    this.setState({
      channelOccupancy: event.occupancy || this.props.minOccupancy,
    });
  }


  getOccupancyText(occupancy) {
    if (occupancy < 100) {
      return `${occupancy}`;
    }

    return '100+';
  }

  getOcuppancyIcon(occupancy) {
    if (occupancy < 50) {
      return <EyeIcon />;
    }

    return <FireIcon />;
  }

  render() {
    const { channelOccupancy } = this.state;
    const text = this.getOccupancyText(channelOccupancy);
    return (
      <span>{this.getOcuppancyIcon(channelOccupancy)} {text}</span>
    );
  }
}

ChannelOccupancy.defaultProps = {
  minOccupancy: 0,
};

ChannelOccupancy.propTypes = {
  channel: PropTypes.string.isRequired,
  pubnub: PropTypes.any.isRequired,
  minOccupancy: PropTypes.number,
};
