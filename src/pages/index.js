import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
import { ChromePicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';

import DnDItems from '../components/DnDItems/index';
import { addNote } from '../redux/actions/notes';
import './style.scss';

class Notes extends Component {
  state = {
    name: '',
    type: '',
    color: '',
    displayColorPicker: false,
    ...this.props,
  }

  colorPickerRef = React.createRef();
  colorShowRef = React.createRef();

  handleClickOutside = (e) => {
    if (this.colorPickerRef && !this.colorPickerRef.current.contains(e.target) &&
          this.colorShowRef && !this.colorShowRef.current.contains(e.target)) {
      this.setState({ displayColorPicker: false })
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleOnChange = ({ target }) => {
    this.setState({ [target.name]: target.value })
  }

  handleOnChangeColor = (color, e) => {
    this.setState({
      color: color.hex + Math.round(color.rgb.a * 255).toString(16),
      source: color.source
    })
  }

  handleOnClick = () => {
    const { displayColorPicker } = this.state;
    this.setState({displayColorPicker: !displayColorPicker})
  }

  handleOnClickAdd = () => {
    const { addNote } = this.props;
    const { name, type, color } = this.state;
    if (name && type) {
      addNote({id: uuidv4(), name: name, type: type, color: color })
      return ;
    }
    alert("Заполните поля")
  }

  render() {
    const { color, displayColorPicker, name, type } = this.state;
    const { notes } = this.props
    // console.log(notes);
    return (
      <div className="notes">
        <div className="notes__header">
          <p className="notes__name"> Имя </p>
          <p className="notes__type"> Тип </p>
          <p className="notes__color"> Цвет </p>
          <p className="notes__action">Действие</p>
        </div>
        <div className="notes__list">
          <div className="notes__input">
            <div className="notes__inputName">
              <Input
                placeholder="Имя"
                name="name"
                onChange={this.handleOnChange}
                value={name}
              />
            </div>
            <div className="notes__inputType">
              <Input
                placeholder="Тип"
                name="type"
                onChange={this.handleOnChange}
                value={type}
              />
            </div>
            <div className="notes__color">
              <div
                className="notes__colorShow"
                onClick={this.handleOnClick}
                ref={this.colorShowRef}
                style={{background: color}}
              />
              <div ref={this.colorPickerRef} className="notes_colorPicker" style={{display: displayColorPicker ? "block" : "none"}}>
                  <ChromePicker onChange={this.handleOnChangeColor} color={color}/>
              </div>
            </div>
            <div className="notes__addItem">
              <Button onClick={this.handleOnClickAdd} type="primary">Добавить</Button>
            </div>
          </div>
          <div className="notes__content">
            <DnDItems list={notes}/>
          </div>
        </div>
      </div>
    )
  }
}
export default connect(state => ({
  notes: state.notes
}), { addNote })(Notes);
