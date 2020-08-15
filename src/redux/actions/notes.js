import { ADD_NOTE, REMOVE_NOTE, EDIT_NOTE, REPLACE_NOTE } from '../../constants';

export const addNote = (payload) => ({
  type: ADD_NOTE,
  payload: {
    ...payload
  }
})

export const removeNote = (payload) => ({
  type: REMOVE_NOTE,
  payload: {
    ...payload
  }
})

export const editNote = (payload) => ({
  type: EDIT_NOTE,
  payload: {
    ...payload
  }
})

export const replaceNote = (payload) => ({
  type: REPLACE_NOTE,
  payload: {
    ...payload
  }
})
