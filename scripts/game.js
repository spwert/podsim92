var MYAPP = MYAPP || {};

// Constants
MYAPP.DOLF_ACC = 120;
MYAPP.DOLF_DRAG = 100;
MYAPP.DOLF_MAX_VEL = 200;

// Global variables
// TODO: global state is bad. get rid of it.
MYAPP.oldCursors = {
    up : false,
    down : false,
    left : false,
    right : false,
    compare : function (newCursors) {
        return ( this.up === newCursors.up &&
                 this.down === newCursors.down &&
                 this.left === newCursors.left &&
                 this.right === newCursors.right );
    },
    set : function (newCursors) {
        this.up = newCursors.up;
        this.down = newCursors.down;
        this.left = newCursors.left;
        this.right = newCursors.right;
        return this;
    }
};

// Phaser.State functions (only one state for now)

MYAPP.gameState = {
    preload : function () {

        MYAPP.game.load.image('space', 'assets/deep-space.jpg');
        MYAPP.game.load.image('ship', 'assets/ship.png');
        MYAPP.game.load.spritesheet('horiz', 'assets/horiz.png', 64, 27, 6, 0, 1);

    },
    create : function () {

        // Speeds things up a little
        MYAPP.game.renderer.clearBeforeRender = false;

        // Simple physics
        MYAPP.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add background, tiling sprite
        MYAPP.game.add.tileSprite(0, 0, 1024, 1024, 'space');

        // Setup world
        MYAPP.game.world.setBounds(0, 0, 1024, 1024);

        // Player sprite
        MYAPP.playerDolf = MYAPP.game.add.sprite(
                MYAPP.game.world.centerX, 
                MYAPP.game.world.centerY, 
                'horiz');
        MYAPP.playerDolf.animations.add('swim');
        MYAPP.playerDolf.animations.play('swim', 5, true);
        MYAPP.dolphinifySprite(MYAPP.playerDolf);

        // Input handling
        MYAPP.cursors = MYAPP.game.input.keyboard.createCursorKeys();

        // Camera
        MYAPP.game.camera.follow(MYAPP.playerDolf);

    },
    update : function () {

        // Handle player's keyboard input

        var newCursors = {
            up : MYAPP.cursors.up.isDown,
            down : MYAPP.cursors.down.isDown,
            left : MYAPP.cursors.left.isDown,
            right : MYAPP.cursors.right.isDown
        };

        if (!MYAPP.oldCursors.compare(newCursors))
        {
            var playerCommand = Object.create(MYAPP.DDirCommand.prototype);
            if (newCursors.up)
            {
                if (newCursors.left)
                {
                    playerCommand.dir = "UL";
                }
                else if (newCursors.right)
                {
                    playerCommand.dir = "UR";
                }
                else
                {
                    playerCommand.dir = "U";
                }
            }
            else if (newCursors.down)
            {
                if (newCursors.left)
                {
                    playerCommand.dir = "DL";
                }
                else if (newCursors.right)
                {
                    playerCommand.dir = "DR";
                }
                else
                {
                    playerCommand.dir = "D";
                }
            }
            else if (newCursors.left)
            {
                playerCommand.dir = "L";
            }
            else if (newCursors.right)
            {
                playerCommand.dir = "R";
            }
            else
            {
                playerCommand.dir = "";
            }

            MYAPP.playerDolf.commandQueue.push(playerCommand);

            MYAPP.oldCursors.set(newCursors);
        }


    },
    render : function () {

        MYAPP.game.debug.cameraInfo(MYAPP.game.camera, 32, 32);
        MYAPP.game.debug.spriteCoords(MYAPP.playerDolf, 32, 500);

    }
}

MYAPP.screenWrap = function (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = MYAPP.game.width;
    }
    else if (sprite.x > MYAPP.game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = MYAPP.game.height;
    }
    else if (sprite.y > MYAPP.game.height)
    {
        sprite.y = 0;
    }

};

// Finally, create and run the game
MYAPP.game = new Phaser.Game(
        800,
        600,
        Phaser.AUTO,
        'phaser-example',
        MYAPP.gameState
    );
