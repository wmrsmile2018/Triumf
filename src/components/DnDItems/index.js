import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import { Input } from 'antd';
import './style.scss';

import { removeNote, editNote, replaceNote } from '../../redux/actions/notes';

class DnDListItem extends Component {
  state = {
    isDragging: false,
    isDragOver: false,
    isEdit: false,
    displayColorPicker: false,
    ...this.props,
  }

  colorShowRef = React.createRef();
  colorPickerRef = React.createRef();

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

  onDragStart = (e) => {
    this.setState({ isDragging : true });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.state.id);
  }

  handleOnClickSave = (e) => {
    const { isEdit, name, color, type, id } = this.state;
    const { editNote } = this.props;
    if (name && type) {
      this.setState({isEdit: !isEdit})
      editNote({id: id, name: name, color: color, type: type})
      return ;
    }
    alert("Заполните поля")
  }

  handleOnClickEdit = (e) => {
    const { isEdit } = this.state;
    this.setState({isEdit: !isEdit})
  }

  handleOnClickRemove = () => {
    const { id } = this.state;
    const { removeNote } = this.props;
    removeNote({id: id})
  }


  handleOnClick = () => {
    const { displayColorPicker } = this.state;
    this.setState({displayColorPicker: !displayColorPicker})
  }

  handleOnChangeColor = (color, e) => {
    this.setState({
      color: color.hex + Math.round(color.rgb.a * 255).toString(16),
      source: color.source
    })
  }

  handleOnChange = ({ target }) => {
    this.setState({ [target.name]: target.value})
  }

  onDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  onDragEnter = (e) => {
    this.setState({isDragOver : true});
  }

  onDragLeave = (e) => {
    this.setState({ isDragOver : false });
  }

  onDrop = (e) => {
    e.stopPropagation()
    this.setState({
      isDragging : false,
      isDragOver : false
    });
    const source = e.dataTransfer.getData('text/html')
    const dragSourceTitle = e.dataTransfer.getData('text/html').slice(source.length - 36);
    this.props.replaceList( dragSourceTitle, this.state.id );
    return false;
  }

  onDragEnd = (e) => {
    this.setState({
      isDragging : false,
      isDragOver : false
    });
  }
  render() {
    const { isDragging, isDragOver, isEdit, color, id, name, type, displayColorPicker } = this.state;
    const arrClassName = [
      isDragging  ? 'dragging' : '',
      isDragOver ? 'dragover' : '',
      isEdit ? 'blink' : ''
    ];
    const strClassName = arrClassName.join(' ');
    return (
      <li draggable='true'
          className={`${strClassName} item__list`}
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          onDragEnd={this.onDragEnd}
          data-id={id}
        >
        {isEdit ?
          <div className="item__input">
            <div className="item__inputName">
              <Input
                name="name"
                onChange={this.handleOnChange}
                value={name}
              />
            </div>
            <div className="item__inputType">
              <Input
                name="type"
                onChange={this.handleOnChange}
                value={type}
              />
            </div>
            <div className="item__color">
              <div
                className="item__colorShow"
                onClick={this.handleOnClick}
                ref={this.colorShowRef}
                style={{background: color}}
              />
              <div ref={this.colorPickerRef} className="item_colorPicker" style={{display: displayColorPicker ? "block" : "none"}}>
                  <CompactPicker onChange={this.handleOnChangeColor} color={color}/>
              </div>
            </div>
          </div>
          :
          <>
            <span data-id={id} className="item__name"> {name}</span>
            <span data-id={id} className="item__type"> {type}</span>
            <span data-id={id} className="item__color" style={{ background: color }}> </span>
          </>
        }
        <div className="item__action">
          <span data-id={id} className="item__move">
            <img
              src="https://cdn2.iconfinder.com/data/icons/material-line/1024/open_with-512.png" alt="move"/>
          </span>
          {isEdit ?
            <span data-id={id} className="item__save">
              <img onClick={this.handleOnClickSave}
                src="https://cdn.iconscout.com/icon/free/png-512/save-171-437037.png" alt="save"/>
            </span>
            :
            <span data-id={id} className="item__edit">
              <img onClick={this.handleOnClickEdit}
                src="https://simpleicon.com/wp-content/uploads/pencil.png" alt="edit"/>
            </span>
          }
          <span data-id={id} className="item__remove">
            <img  onClick={this.handleOnClickRemove}
              src="https://cdn4.iconfinder.com/data/icons/complete-common-version-6-4/1024/trash-512.png" alt="remove"/>
          </span>
        </div>
      </li>
    );
  }
}

class DnDItems extends Component {
  state = {
    ...this.props
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.list !== prevProps.list) {
      this.setState({ list: this.props.list})
    }
  }

  replaceList = (dragSourceTitle, dropTargetTitle) => {
    const { replaceNote } = this.props;
    let dragSourceIndex = this.state.list.findIndex((item) => item.id == dragSourceTitle);
    let dropTargetIndex = this.state.list.findIndex((item) => item.id == dropTargetTitle);
    if( dragSourceIndex == dropTargetIndex ) {
      return;
    }

    let list = this.state.list;
    let removed = list.splice( dragSourceIndex, 1, this.state.list[dropTargetIndex] );
    list.splice( dropTargetIndex, 1, removed[0] );
    this.setState({ list });
    replaceNote({list: list})
  }

  render() {
    const { list } = this.state;

    return (
      <ul className="draggable-list">
        {list.map((item, index) => (
          <DnDListItem
            key={item.id}
            name={item.name}
            type={item.type}
            id={item.id}
            color={item.color}
            replaceList={this.replaceList}
            removeNote={this.props.removeNote}
            editNote={this.props.editNote}
            />
        ))}
    </ul>
    );
  }
}

export default connect (state => ({
}), {removeNote, editNote, replaceNote})(DnDItems)
