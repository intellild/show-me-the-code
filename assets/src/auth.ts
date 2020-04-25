import * as cookie from 'cookie';
import { environment } from './environments/environment';

let { token } = cookie.parse(document.cookie);

if (environment.production) {
  if (!token) {
    location.href = '//login.icode.live';
  }
} else {
  token = sessionStorage.getItem('token');
  if (!token) {
    token = prompt('username', `user:${Date.now()}`);
    sessionStorage.setItem('token', token);
  }
}

export { token };
