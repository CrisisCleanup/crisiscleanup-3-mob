import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

const userSelector = (state) => state.user;

export const userProfileImage = createSelector(userSelector, (user) => {
  if (user && user.files && user.files.length) {
    const profilePictures = user.files.filter(
      (file) => file.file_type_t === 'fileTypes.user_profile_picture',
    );
    if (profilePictures.length) {
      return profilePictures[0].url;
    }
  }
  return user
    ? `https://api.adorable.io/avatars/285/ccu-user-${user.id}.png`
    : 'https://api.adorable.io/avatars/285/user.png';
});

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false,
        },
      ];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      );
    default:
      return state;
  }
};

const incidents = (
  state = {
    incidents: [],
    incident: {},
  },
  action,
) => {
  switch (action.type) {
    case 'SET_INCIDENTS':
      return {
        ...state,
        incidents: action.incidents,
      };
    case 'SET_CURRENT_INCIDENT':
      return {
        ...state,
        incident: action.incident,
      };
    default:
      return state;
  }
};

const auth = (
  state = {
    currentUser: null,
    accessToken: null,
  },
  action,
) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.user,
        accessToken: action.token,
      };
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.token,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default combineReducers({
  todos,
  incidents,
  auth,
});
