/* global Phaser, gyro */

window.onload = function () {

    // game definition, 320x480
    var game = new Phaser.Game(320, 480, Phaser.CANVAS, "", {boot: onBoot, preload: onPreload, create: onCreate, update: update, render: render});

    var boss;
    var paper;
    var player;
    var bgtile;
    var bgsound;
    var score;
    var gameOver;
    var hit;
    var loading;
    
    // function to scale up the game to full screen
    function goFullScreen() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize(true);
    }

    function onBoot() {
        // initializing physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // going full screen
        goFullScreen();
    }
    // function executed on preload to load assets
    function onPreload() {
        // display Loading text while game is loading
        loading = game.add.text(game.world.centerX, game.world.centerY, "Loading...",{
                font:"bold 50px Courier",
                fill: "#fff"
            });
        loading.anchor.setTo(0.5);

        // game.load.setPreloadSprite(loading);
        game.load.spritesheet("player", "assets/mainchar.png",32,64);
        game.load.spritesheet("boss","assets/Boss.png",32,32);
        game.load.spritesheet("paper","assets/Paper.png",32,32);
        game.load.image("bgtile", "assets/office.png");
        game.load.image("gameOver", "assets/ui/gameOver.png")
        game.load.audio("bgsound", ["assets/sounds/mainBackground.ogg","assets/sounds/mainBackground.mp3", "assets/sounds/mainBackground.m4a"]);
        game.load.audio("hit", ['assets/sounds/hit.ogg',"assets/sounds/hit.mp3","assets/sounds/hit.m4a"]);

    }

    // function to be called when the game has been created
    function onCreate() {
        //tile background
        bgtile = game.add.tileSprite(0,0,320,480, "bgtile");

        //add background music
        bgsound = game.add.audio("bgsound");
        bgsound.play();

        // adding the player on stage
        player = game.add.sprite(160, 320, "player");
        player.frame = 0;
        player.animations.add('playerRun', [0, 1], 8, true);
        player.animations.play('playerRun');
        
        //Set Gravity
        game.physics.arcade.gravity.y = 150;
        // setting player anchor point
        player.anchor.setTo(0.5, -1.5);
        // enabling physics car.body.collideWorldBounds = true;
        game.physics.enable(player, Phaser.Physics.ARCADE);
        // the player will collide with bounds
        player.body.collideWorldBounds = true;
        // setting player bounce
        player.body.bounce.set(0.0);

        // setting gyroscope update frequency
        gyro.frequency = 5;
        // start gyroscope detection
        gyro.startTracking(function (o) {
            
            //Player's position confined to the bounds of the background
            if(!(o.gamma > 45||o.gamma < -45)){
                player.x = 164 + o.gamma * 2;
            }else{
                if(o.gamma > 0){
                    player.x = 254;
                }else{
                    player.x = 74
                }
            }
            //Player's position set to the bottom of the screen.
            player.y = 320;
        });

        //Random spawns of enemies.
        game.time.events.repeat(Phaser.Timer.SECOND * 10, 60, newBoss, this);
        game.time.events.repeat(Phaser.Timer.SECOND * 3, 2400, newPaper, this);
    }

    function newBoss() {
        // adding Boss obstacle on the stage
        var random = game.rnd.integerInRange(74, 254);
        boss = game.add.sprite(random, 0, "boss");
        game.physics.enable(boss, Phaser.Physics.ARCADE);
        boss.body.collideWorldBounds = false;
        //Update boss size
        boss.scale.setTo(2);
        boss.frame = 0;
    }
    function newPaper(){
        // adding Paper obstacle on the stage
        var random = game.rnd.integerInRange(74, 254);
        paper = game.add.sprite(random, 0, "paper");
        game.physics.enable(paper, Phaser.Physics.ARCADE);
        paper.body.collideWorldBounds = false;
        paper.frame = 0;
    }
    function handleCollision(){
        //handle collision
        //switching player's animation from "run" to "die"
        player.animations.add('die',[3,4,5],4,false);
        player.animations.play('die');
        gameOver = game.add.sprite(game.world.centerX-120, game.world.centerY-100, "gameOver");
        //play hit sound
        hit = game.add.audio('hit');
        hit.play();

        game.physics.arcade.gravity.y = 0;
    }

    function update() {
        bgtile.tilePosition.y += 2;

        //collision detection
        game.physics.arcade.collide(player, boss, handleCollision);
        game.physics.arcade.collide(player, paper, handleCollision);
    }

function render() {
        //display score on the screen (1 second = score 1000)
        var seconds = game.time.totalElapsedSeconds().toFixed(0);
        game.debug.text('Score: ' + seconds * 1000, 64, 64);
       
    }
}