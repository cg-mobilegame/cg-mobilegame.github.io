window.onload = function () {

    // game definition, 320x480
    var game = new Phaser.Game(320, 480, Phaser.CANVAS, "", {preload: onPreload, create: onCreate, update: update});

    // the player
    var player;
    var bgtile;
    var bgtileAhead;

    // function executed on preload
    function onPreload() {
        game.load.image("player", "mainCharacter/shoot_up.png");
        game.load.image("bgtile", "office.jpg");
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

        // adding the player on stage
        player = game.add.sprite(160, 240, "player");
        //bgtile = game.add.tileSprite(0,0,game.stage.bounds.width, game.cache.getImage('bgtile').height, 'bgtile');
        //change background color

        //game.stage.backgroundColor = '#fff7af';
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
            player.body.x = o.gamma; // TODO, CHANGE THIS??
            player.body.y = o.beta;
        });
    }

    function update() {

//        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
//        {
//            bgtile.x -= 4;
//            bgtileAhead.x -= 4;
//        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
//        {
//            bgtile.x += 4;
//            bgtileAhead.x += 4;
//        }
//
//        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
//        {
//            bgtile.y -= 4;
//            bgtileAhead.y -= 4;
//        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
//        {
//            bgtile.y += 4;
//            bgtileAhead.y += 4;
//        }

        bgtile.y += 3;
        bgtileAhead.y += 3;
        if(bgtile.y > game.world.centerY * 2){
            bgtile.y = -game.world.centerY;
        }
        if(bgtileAhead.y > game.world.centerY * 2){
            bgtileAhead.y = -game.world.centerY;
        }

    }

    // function update() {
    //      bgtile.tilePosition.x -= 1;
    // }
}