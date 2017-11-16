import 'babel-polyfill';
import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal,ModalManager,Effect} from '../../lib';

class MyModal extends Component{
   render(){
      const {content,effect, onOk, isModal} = this.props;
      return (
        <Modal
            isModal={isModal}
          effect={effect}
          onRequestClose={() => true}
          >
            <div className="modal-header">
              <h4 className="modal-title">What you input</h4>
            </div>
            <div className="modal-body">
              <h4>{content}</h4>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={()=>{
                  ModalManager.close();
              }}>Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>{
                  if(onOk){
                      onOk();
                  }
              }}>OK</button>
            </div>
        </Modal>
      );
   }
}



class App extends Component{
    constructor(props) {
        super(props);
        this.id1 = -1;
        this.id2 = -1;

    }

    open3(){
        ModalManager.open(<MyModal onOk={()=>{
            ModalManager.close(this.id1);
        }}content="this is the third modal" effect={Effect.RotateFromLeft3D}/>);
    }

    open2(){
        this.id2 = ModalManager.open(<MyModal onOk={this.open3.bind(this)} content="this is the second modal" effect={Effect.SlideFromRight}/>);
    }

   openModal(effect){
      var content = this.refs.input.value;
      this.id1 = ModalManager.open(<MyModal isModal={false} onOk={this.open2.bind(this)} content={content} effect={effect}/>, document.getElementById('modalroot'));
   }
   render(){

      const effects = {
        'FADE IN & SCALE' : Effect.ScaleUp,
        'SLIDE IN (RIGHT)' : Effect.SlideFromRight,
        'SLIDE IN (BOTTOM)' : Effect.SlideFromBottom,
        'NEWSPAPER' : Effect.Newspaper,
        'FALL' : Effect.Fall,
        'SIDE FALL' : Effect.SideFall,
        '3D FLIP (HORIZONTAL)' : Effect.FlipHorizontal3D,
        '3D FLIP (VERTICAL)' : Effect.FlipVertical3D,
        '3D SIGN' : Effect.Sign3D,
        'SUPER SCALED' : Effect.SuperScaled,
        '3D ROTATE BOTTOM' : Effect.RotateFromBottom3D,
        '3D ROTATE LEFT' : Effect.RotateFromLeft3D,
      };

      return (
        <div className="container" style={{marginTop:20}}>
            <div className="row">
                <div className="col-xs-offset-4 col-xs-4">
                    <div style={{margin:10}}>
                        <textarea rows="3" defaultValue="There are many possibilities for modal overlays to appear. Here are some modern ways of showing them using CSS transitions and animations." className="form-control" ref='input' />
                    </div>
                    <div>
                     { Object.keys(effects).map( (label, index) => {
                        const effect = effects[label];
                        return (
                          <button key={index} className="btn btn-primary" role="button" type="button" style={{'float' : 'left',margin:5}} onClick={() => this.openModal(effect)}>{label}</button>
                        );
                     })}
                    </div>
                </div>
            </div>
        </div>
      );
   }
}

ReactDOM.render(<App />, document.getElementById('main'));
