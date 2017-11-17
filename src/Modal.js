import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import Assign from 'lodash.assign';

const prefix = require('react-prefixr');

const defaultStyles = {
  overlay: {
    position        : 'fixed',
    top             : 0,
    left            : 0,
    right           : 0,
    bottom          : 0,
    zIndex          : 99999999,
    overflow        : 'hidden',
    perspective     :  1300,
    backgroundColor : 'rgba(0, 0, 0, 0.3)'
  },

  content: {
    position                : 'relative',
    margin                  : '15% auto',
    width                   : '60%',
    border                  : '1px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'auto',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
  }
};

const defaultTransition = {
   property : 'all',
   duration : 300,
   timingfunction : 'linear',
};

const stopPropagation = (e) => e.stopPropagation();

let onClose;

export class Modal extends Component{
   constructor(props){
      super(props);
      this.isModal = true;
      this.state = {
         open : false
      }

       const transitionTimeMS = this.getTransitionDuration();
       onClose = (callback) => {
           this.setState({open: false}, () => {
               this.closeTimer = setTimeout(callback, transitionTimeMS);
           });
       };
   }
   close(){
       if(!this.props.onRequestClose || this.props.onRequestClose()){
          ModalManager.close();
       }
   }
   handleKeyDown(event){
      if (event.keyCode == 27 /*esc*/){
          this.close();
      }
   }
   componentDidMount(){
      setTimeout(() => this.setState({open : true}),0);
   }
   componentWillUnmount(){
       onClose = null;
      clearTimeout(this.closeTimer);
   }

    /**
     * 获得缓动时间
     * @returns {number}
     */
   getTransitionDuration(){
     const { effect } = this.props;
     if(!effect.transition){
        return defaultTransition.duration;
     }
     return effect.transition.duration || defaultTransition.duration;
   }
   render(){
      const {style,effect, isModal} = this.props;
      const { open } = this.state;

      let transition = effect.transition;
      if(!transition){
        transition = defaultTransition;
      }else{
        transition = Assign({},defaultTransition,transition);
      }
      let transition_style = {
        	'transition': transition.property+' '+(transition.duration / 1000) + 's'+' '+transition.timingfunction
      };
       if(isModal!=undefined){
           this.isModal = isModal;
       }
      if(this.isModal){
          return (
              <div
                  ref="overlay"
                  style={prefix(Assign({},defaultStyles.overlay,style ? (style.overlay ? style.overlay : {}) : {},{ transition: 'opacity '+(transition.duration / 1000) + 's'+' linear',opacity: open ? 1 : 0}))}
                  onClick={this.close.bind(this)}>

                  <div
                      ref="content"
                      style={prefix(Assign({},defaultStyles.content,style ? (style.content ? style.content : {}) : {},transition_style,open ? effect.end : effect.begin))}
                      onClick={stopPropagation}
                      onKeyDown={this.handleKeyDown.bind(this)}>
                      {this.props.children}
                  </div>
              </div>
          );
      }
      else{
          return (
              <div
                  ref="content"
                  style={prefix(Assign({},defaultStyles.content,style ? (style.content ? style.content : {}) : {},transition_style,open ? effect.end : effect.begin))}
                  onClick={stopPropagation}
                  onKeyDown={this.handleKeyDown.bind(this)}>
                  {this.props.children}
              </div>
          );
      }
   }
}

let modals = [];
let _modalUid = 0;

const getUID = ()=>{
    if(_modalUid >= Number.MAX_VALUE){
        _modalUid = 0;
    }
    return ++_modalUid;
}

export const ModalManager = {
    /**
     * 打开一个弹窗
     * @param component
     * @param container
     * @returns {number} 返回弹窗id
     */
    open(component, modalRoot=null){
        let modalId = -1;
        if(component){
            modalId = getUID();
            let container = document.createElement('div');
            container.id = "modalContainer_"+modalId;
            if(modalRoot){
                modalRoot.appendChild(container);
            }
            else{
                document.body.appendChild(container);
            }
            let modalInstance = ReactDOM.render(component,container, ()=>{
                modals.push({modalId:modalId, component:component, container:container, onClose:onClose});
            });
            modalInstance.__modalId = modalId;
        }
        return modalId;
    },

    /**
     * 关闭一个弹窗 如果没传递id 默认关闭最上面一个
     * @param modalId 弹窗id
     */
    close(modalId){
        if(modals.length>0){
            let modalInfo = null;
            if(modalId!=undefined && !isNaN(modalId)){
                for(let i=0;i<modals.length;i++){
                    let info = modals[i];
                    if(info.modalId == modalId){
                        modalInfo = info;
                        modals.splice(i, 1);
                        break;
                    }
                }
            }
            else{
                modalInfo = modals.pop();
            }
            if(modalInfo){
                if(modalInfo.onClose){
                    modalInfo.onClose(() => {
                        if(modalInfo.container){
                            ReactDOM.unmountComponentAtNode(modalInfo.container);
                            if(modalInfo.container.parentNode){
                                modalInfo.container.parentNode.removeChild(modalInfo.container);
                            }
                            modalInfo.component = null;
                            modalInfo.container = null;
                            modalInfo.onClose = null;
                        }
                    });
                }
            }
        }
    }
}
