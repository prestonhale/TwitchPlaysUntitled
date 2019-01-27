/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import fly from "../sprites/fly.js"
import lang from '../lang'
import averagedPlayerController from '../sprites/averagedPlayerController.js'

export default class extends Phaser.State {
  

  testWebSocket()
  {
    this.websocket = new WebSocket("ws://tpg45.herokuapp.com/game_receive");
    var webLocal = this.websocket;
    this.websocket.addEventListener('open', function (event) {
      console.log("connected");
    });
    var localObj = this;
    this.websocket.addEventListener('message', function (event) {
      console.log("event recieved");
      console.log('Message from server ' + event.data);
      var control = JSON.parse(event.data);

      if(!Array.isArray(control)){
         control = [control];
      }
      for(var i = 0; i < control.length; i++){
        var obj = control[i];
        localObj.addRowOfData(obj.name, obj.direction);
        localObj.game.inputQueue.push(obj);
        localObj.averagedPlayerController.setInputList(localObj.game.inputQueue);
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
    this.baseSpeed = 100;
    this.game.inputQueue = [];
    let websocket_url="ws://tpg45.herokuapp.com/game_receive";

    if(this.devMode){
      this.cursors = game.input.keyboard.createCursorKeys();
    }
    const bannerText = lang.text('welcome')
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    this.inputQueue = []

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)
    
    this.averagedPlayerController = new averagedPlayerController({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'chameleon',
      baseSpeed: this.baseSpeed
    })
    var anim = this.averagedPlayerController.animations.add("walk");
    this.averagedPlayerController.animations.play("walk", 5, true);

    this.game.world.setBounds(0,0,5000,800)
    this.game.camera.follow(this.averagedPlayerController, 2);

    // ******************************
    //        CREATING WATER TILES
    // EDIT this.waterCoord TO PLACE WATERS
    // ******************************
    this.waterGroup = game.add.physicsGroup();
    this.waterCoord = [[0,0],[100,0],[200,0],[300,0],[400,0],[500,0],[600,0],[700,0],[800,0],[900,0],[1000,0], 
    [0,700],[100,700],[200,700],[300,700],[400,700],[500,700],[600,700],[700,700],[800,700],[900,700],[1000,700],
    [0,600],
    [100,500],[100,600],
    [200,400],[200,500],[200,600],
    [300,100],[300,400],[300,500],[300,600],
    [400,100],[400,400],[400,500],[400,600],
    [500,100],[500,500],[500,600],
    [600,100],[600,600],[600,200],
    [700,100],[700,200],[700,300],
    [900,600],
    [1000,200],[1000,300],[1000,600],[1000,500]]

    for (var i = 0; i < this.waterCoord.length; i++)
      {
        var c = this.waterGroup.create(this.waterCoord[i][0], this.waterCoord[i][1], 'water', 0)
        c.scale.setTo(1, 1);
      }
    // ******************************

    // ******************************
    //         CREATING FLIES
    // ******************************
    this.fly = new fly({
      game: this.game,
      x: 1000,
      y: 250,
      asset: 'fly',
      x_mov: 50,
      y_mov: 0
    })

    this.game.add.existing(this.waterGroup)
    this.game.add.existing(this.fly)
    this.game.add.existing(this.averagedPlayerController)

    this.game.physics.arcade.enable([this.averagedPlayerController, this.waterGroup, this.fly]);
    this.testWebSocket();
  }

  update(){
    if(this.devMode){
      var obj;
      if(this.cursors.right.isDown){

        obj = {
          "direction":"right"
        }
      }
       if(this.cursors.left.isDown){

        obj = {
          "direction":"left"
        }
      }
      
      if(this.cursors.down.isDown){

        obj = {
          "direction":"down"
        }
      }
      if(this.cursors.up.isDown)

        obj = {
          "direction":"up"
        }

        if(obj!=null);
            this.game.inputQueue.push(obj);
      }
      
      // this.averagedPlayerController.setInputList(this.game.inputQueue);
    // Collision Detection
    game.physics.arcade.overlap(this.averagedPlayerController, this.waterGroup, this.playerWaterCollision, null)
    game.physics.arcade.overlap(this.averagedPlayerController, this.fly, this.playerFlyCollision, null)

     //CAMERA LOGIC


    
  } 

  restartGame(){
    this.restart()
  }

  playerWaterCollision(){
    console.log('WaterCollision')
    //this.averagedPlayerController.x = 500;
    //this.averagedPlayerController.y = 500;
  }

  playerFlyCollision(){
    console.log('FlyCollision')
    //this.averagedPlayerController.x = 500;
    //this.averagedPlayerController.y = 500;
  }

  //   function init()
  // {
  //   output = document.getElementById("output");
  //   testWebSocket();
  // }
  addRowOfData(name, direction){
    var sideTable = document.querySelector("#Inputs");
    if(sideTable == null) {alert("fuck you")};
    var row = document.createElement("tr");
    var column1 = document.createElement("td");
    var column2 = document.createElement("td");

    row.appendChild(column1);
    row.appendChild(column2);
    sideTable.appendChild(row);



    column1.appendChild(document.createTextNode(name));
    column2.appendChild(document.createTextNode(direction));


    var rightDiv = document.querySelector("#RightDiv");
    rightDiv.scrollTop = rightDiv.scrollHeight;


  }

}
