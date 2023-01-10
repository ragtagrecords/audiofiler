import axios from 'axios';
import { APP_ACTIONS } from 'Components/App/appSlice';
import { databaseServerURL } from 'env';
import { store } from 'Hooks/store';
import { User } from 'Types';

export const authenticate = async (): Promise<User | null> => {
  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    return null;
  }

  let res;
  try {
    res = await axios.get(
      `${databaseServerURL()}/authenticate`,
      {
        headers: {
          'x-access-token': accessToken,
        },
      },
    );
    if (!res.data.auth) {
      throw new Error('Token failed to authenticate');
    }

    const user = {
      id: res.data.id,
      username: res.data.username,
    };
    return user;
  } catch (e: any) {
    console.log(e.message);
    localStorage.clear();
    return null;
  }
};

export const logout = async () => {
  store.dispatch(APP_ACTIONS.setUser(null));
  localStorage.clear();
  return true;
};

// Returns true if the credentials are valid, false otherwise
export const authorize = async (username: string, password: string) => {
  const formData = new FormData();

  // add songs to form data
  formData.append('username', username);
  formData.append('password', password);

  let res;
  try {
    res = await axios.post(
      `${databaseServerURL()}/authorize`,
      formData,
    );
  } catch (ex) {
    console.log(ex);
    return false;
  }
  if (!res.data.auth || !res.data.token) {
    return false;
  }
  await localStorage.setItem('token', res.data.token);
  store.dispatch(APP_ACTIONS.setUser({ ...res.data.user }));
  return true;
};

// Returns true if the credentials are valid, false otherwise
export const signup = async (username: string, password: string) => {
  const formData = new FormData();

  // add songs to form data
  formData.append('username', username);
  formData.append('password', password);

  let res = null;
  try {
    res = await axios.post(
      `${databaseServerURL()}/users`,
      formData,
    );
  } catch (ex) {
    console.log(ex);
    return false;
  }

  // user wasnt created
  if (!res.data.added) {
    return false;
  }

  // user created but couldnt login for some reason
  if (!res.data.token) {
    return false;
  }

  await localStorage.setItem('token', res.data.token);
  await localStorage.setItem('username', username);
  return true;
};
