/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang'
import averagedPlayerController from '../sprites/averagedPlayerController.js'

export default class extends Phaser.State {
  

  testWebSocket(websocket_url)
  {
    this.websocket = new WebSocket(websocket_url);
    this.websocket.addEventListener('open', function (event) {
      console.log("connected");
    });
    var localObj = this;
    this.websocket.addEventListener('message', function (event) {
      console.log("event recieved");
      console.log('Message from server ' + event.data);
      var control = JSON.parse(event.data);


      if(!Array.isArray(control)) {
        control = [control];
      }
      for(var i = 0; i < control.length; i++){
        var obj = control[i];
        localObj.inputQueue.push(obj);
        console.log(localObj.inputQueue);
        localObj.averagedPlayerController.setInputList(localObj.inputQueue);
      }

    });

  }

  init() { }
  

  preload() { 
       this.output;
    }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.devMode = true;
    this.baseSpeed = 1000;
    this.inputQueue = [];
    let websocket_url="ws://tpg45.herokuapp.com/game_receive";
    if(this.devMode){
      this.cursors = game.input.keyboard.createCursorKeys();
      websocket_url="ws://0.0.0.0:5000/game_receive";
    }
    const bannerText = lang.text('welcome')
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    });


    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)
    
    this.averagedPlayerController = new averagedPlayerController({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom',
      baseSpeed: this.baseSpeed,
    });


    this.game.add.existing(this.averagedPlayerController);

    this.game.physics.arcade.enable([this.averagedPlayerController]);
    this.testWebSocket(websocket_url);
  }

  update() {
    if (this.devMode) {
      var obj;
      if (this.cursors.right.isDown) {
        obj = {
          "direction": "right"
        }
      }
      if (this.cursors.left.isDown) {
        obj = {
          "direction": "left"
        }
      }
      if (this.cursors.down.isDown) {
        obj = {
          "direction": "down"
        }
      }
      if (this.cursors.up.isDown) {
        obj = {
          "direction": "up"
        }
      }
      if (obj) {
        this.inputQueue.push(obj);
        this.averagedPlayerController.setInputList(this.inputQueue);
      }
    }
  }

    //   function init()
    // {
    //   output = document.getElementById("output");
    //   testWebSocket();
    // }
//
}
