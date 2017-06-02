import { connect }   from 'react-redux';
import Topics from '../components/topics';

const mapStateToProps = (state, props) => {
  return {
    topics: state.getIn(['meta', 'topics']),
  };
};

export default connect(mapStateToProps)(Topics);
