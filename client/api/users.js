import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postCheckEmail = email =>
  request.post('/api/users/checkemail')
    .send({ email })
    .then(handleSuccess)
    .catch(handleError);
