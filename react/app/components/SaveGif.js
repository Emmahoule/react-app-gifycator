import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { saveStory } from '../actions/CreateGifActions.js';
import { fetchCategories } from '../actions/CategoriesActions.js';

import { config } from '../config.js'
const API_URL = config.API_URL;


/* Component SaveGif : 
 * 
 * Conteneur qui récupère la vidéo concaténée
 * et qui affiche des champs de formulaire pour
 * ajouter des infos à l'histoire (titre, auteur, 
 * image de couverture, catégorie). 
*/

export default class SaveGif extends Component {

  constructor(){
    super();
    this.state = {
      categoryName: "Choose a category",
      categoryValue: "",
      open: false,
      title: "", 
      author: "",
      cover: ""
    }
    this.selectCat;
    this.video;
  }

  /* componentDidMount : 
   * 
   * Met à jour l'état du composant 
   * pour passer une classe "open" au select
   * si il est ouvert, et "closed" si il est fermé
  */  
  componentWillMount(){
    this.props.dispatch(fetchCategories());
  }

  /* onClickSelect : 
   * 
   * Met à jour l'état du composant 
   * pour passer une classe "open" au select
   * si il est ouvert, et "closed" si il est fermé
  */  
  onClickSelect() {
    if (!this.state.open) {
      this.setState({
        open : true
      });
    } else {
      this.setState({
        open : false
      });      
    }
  }

  /* onClickSelectItem : 
   * 
   * Met à jour l'état du composant 
   * pour afficher la valeur sélectionnée
   * dans le select
  */  
  onClickSelectItem(e){
    let value = e.target.getAttribute("data-value");
    let text = e.target.innerHTML;
    this.setState({
      categoryName : text,
      categoryValue : value,
      open : false
    });
  }

  /* onClickCoverBtn : 
   * 
   * Ajoute le contrôle de la vidéo,
   * et la remet au début
   * pour choisir une photo de couverture
  */  
  onClickCoverBtn() {
    this.video.pause();
    this.video.currentTime = 0;
    this.video.controls=true;
  }

  /* onClickValidateBtn : 
   * 
   * Au clique sur valider,
   * capture d'une image de couverture
   * pour la vidéo
  */  
  onClickValidateBtn(){
    this.captureCoverVideo();
  }

  /* captureCoverVideo : 
   * 
   * Capture dans un canvas d'une image de couverture
   * pour la vidéo, et envoie des données de la vidéo
   * avec son image de couverture
  */  
  captureCoverVideo(){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = this.video.videoWidth;
    var height = this.video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    var coverImg = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    this.setState({
      cover: coverImg
    });
    this.sendData(coverImg);
  }

  /* sendData : 
   * - parameter : coverImg 
   * 
   * Prend en paramètre l'image de couverture de la vidéo
   * et ajoute les données de la vidéo dans un formulaire.
   * Envoie de ce formulaire au serveur pour enregistrer les données
   * dans la BDD.
  */  
  sendData(coverImg){
    let form = new FormData();
    form.append("url", this.props.story);
    form.append("cover", coverImg);
    form.append("title", this.state.title);
    form.append("author", this.state.author);
    form.append("category", this.state.categoryValue);
    this.props.dispatch(saveStory(form, this.props.history));
  }

  render() {
    const { dispatch, story, dataCategories } = this.props;
    return (
        <div className="save-gif">
        	<div className="create-story-title title-2">Congratulation !</div>
          <div className="save-gif-top">
            <input type="text" className="save-gif-input-name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} placeholder="Title"/>
            <input type="text" className="save-gif-input-author" value={this.state.author}  onChange={(e)=>this.setState({author:e.target.value})} placeholder="Author"/>
            <div className={"select save-gif-select" + (this.state.open ? " open" : " closed")} ref={e=>this.selectCat=e}>
              <div className="select-selected" onClick={this.onClickSelect.bind(this)} data-value={this.state.categoryValue}>{this.state.categoryName}</div>
              {dataCategories &&
                <ul className="select-list">
                {dataCategories.map(function(category){
                  return <li key={category.id} className="select-list-item" data-value={category.id} onClick={this.onClickSelectItem.bind(this)}>{category.name}</li>
                }.bind(this))}
                </ul>
              }
            </div>
            <div className="btn1 save-gif-cover-btn" onClick={this.onClickCoverBtn.bind(this)}>Select a cover</div>
          </div>
          <div className="save-gif-bottom">
            <video crossOrigin="anonymous" autoPlay="true" width="250" height="250" loop="loop" preload="metadata" className="save-gif-video" ref={e=>this.video=e} src={API_URL+story}></video>
          </div>
          <div className="btn1 save-gif-btn" onClick={this.onClickValidateBtn.bind(this)}>Valider</div>
        </div>
    )
  }
}

SaveGif.propTypes = {
  dispatch: PropTypes.func.isRequired,
  story: PropTypes.string.isRequired,
  dataCategories: PropTypes.array
}
