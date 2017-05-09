/* global Phaser, gyro */

window.onload = function () {

    // game definition, 320x480
    var game = new Phaser.Game(320, 480, Phaser.CANVAS, "", {preload: onPreload, create: onCreate, update: update, render: render});

    // the player
    var boss;
    var paper;
    var player;
    var bgtile;
    var bgtileAhead;
    var bgsound;
    
    // function executed on preload
    function onPreload() {
        game.load.spritesheet("player", "assets/guy.png",32,64);
        game.load.spritesheet("boss","assets/Boss.png",32,32);
        game.load.spritesheet("paper","assets/Paper.png",32,32);
        game.load.image("bgtile", "assets/office.png");
        game.load.audio("bgsound", "assets/sounds/mainBackground.ogg");

    }

    // function to scale up the game to full screen
    function goFullScreen() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize(true);
    }

    // function to be called when the game has been created
    function onCreate() {
        // initializing physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // going full screen
        goFullScreen();

        bgtile = game.add.sprite(game.world.centerX, game.world.centerY, "bgtile");
        bgtile.anchor.setTo(0.5, 0.5);
        bgtileAhead = game.add.sprite(game.world.centerX, -game.world.centerY, "bgtile");
        bgtileAhead.anchor.setTo(0.5, 0.5);

        //bgsound = new Phaser.sound('bgsound',1,true); //true means looping is enabled.
        //setTimeout(function() {bgsound.play();},100);

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
            // updating player velocity
            //player.body.velocity.x += o.gamma / 20; // TODO, CHANGE THIS
            //player.body.velocity.y += o.beta / 20;
            
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
        game.time.events.repeat(Phaser.Timer.SECOND * 3, 200, newPaper, this);
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
        player.animations.stop('playerRun', true);
        game.physics.arcade.gravity.y = 0;
        game.time.events.pause();
        var score = game.time.totalElapsedSeconds().toFixed(0);
        game.debug.text('You scored' + score * 1000, 120, 64);
    }

    function update() {
        bgtile.y += 2;
        bgtileAhead.y += 2;
        if(bgtile.y > game.world.centerY * 3 - 1){
            bgtile.y = -game.world.centerY + 1;
        }
        if(bgtileAhead.y > game.world.centerY * 3 - 1){
            bgtileAhead.y = -game.world.centerY + 1;
        }
        game.physics.arcade.collide(player, boss, handleCollision);
        game.physics.arcade.collide(player, paper, handleCollision);
    }
    
    function render() {
        //game.debug.spriteInfo(player, 32, 32);
        var seconds = game.time.totalElapsedSeconds().toFixed(0);
        game.debug.text('Score: ' + seconds * 1000, 64, 64);
    }
}