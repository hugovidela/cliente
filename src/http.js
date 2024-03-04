import axios from 'axios';
// eslint-disable-next-line import/no-cycle
import store from './store/index';

// eslint-disable-next-line arrow-body-style
export default () => {
  return axios.create({
    baseURL: store.state.baseUrl,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${store.state.authentication.token}`,
    },
  });
};
