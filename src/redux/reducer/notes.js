import { ADD_NOTE, REMOVE_NOTE, EDIT_NOTE, REPLACE_NOTE } from '../../constants';
import { load, clear } from 'redux-localstorage-simple';
import { v4 as uuidv4 } from 'uuid';

// clear({ namespace: "notes" })

let NOTES = load({ namespace: "notes" })

if (!NOTES || !NOTES.notes || !NOTES.notes.length) {
  NOTES = {
    notes: [
      {id: uuidv4(), name: "name1", type: "type1", color: "#542929"},
      {id: uuidv4(), name: "name2", type: "type2", color: "#542929"},
      {id: uuidv4(), name: "name3", type: "type3", color: "#542929"},
      {id: uuidv4(), name: "name4", type: "type4", color: "#542929"}
    ]
  }
}

export const notes = function reducer(state = NOTES.notes, action) {
  switch (action.type) {
    case ADD_NOTE:
      return [
        { ...action.payload }, ...state
      ]
////////////////////////////////////////////////////////////////////////////////
    case EDIT_NOTE:
      window.state = state;
      window.action = action;
      return [...state].map(val => val.id === action.payload.id ?
          {...val, name: action.payload.name, type: action.payload.type, color: action.payload.color}
          : val
        )
////////////////////////////////////////////////////////////////////////////////
    case REMOVE_NOTE:
      return [...state].filter(val => val.id !== action.payload.id)
    case REPLACE_NOTE:
      return action.payload.list
    default:
      return state
  }
}
