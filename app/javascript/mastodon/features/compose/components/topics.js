import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

class Topics extends React.PureComponent {

  static propTypes = {
    topics: ImmutablePropTypes.list.isRequired,
  };

  render () {
    const { topics } = this.props;
    return (
      <div className="topics">
        <div className="topics__heading">Topics</div>
        <ul>
          {topics.toSeq().map((topic) =>
            <li key={topic}><Link to={`/timelines/tag/${encodeURIComponent(topic)}`}>#{topic}</Link></li>)}
        </ul>
      </div>
    );
  }

}

export default Topics;
