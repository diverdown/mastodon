import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

const Topics = React.createClass({
  propTypes: {
    topics: ImmutablePropTypes.list.isRequired
  },

  mixins: [PureRenderMixin],

  render () {
    const {topics} = this.props;
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
});

export default Topics;
