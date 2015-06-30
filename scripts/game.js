var MYAPP = {};

// Constants
MYAPP.DOLF_ACC = 120;
MYAPP.DOLF_DRAG = 100;
MYAPP.DOLF_MAX_VEL = 200;

// Global variables
// TODO: global variables are bad. get rid of them.
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

MYAPP.preloadGame = function () {

    MYAPP.game.load.image('space', 'assets/deep-space.jpg');
    MYAPP.game.load.image('ship', 'assets/ship.png');

};

MYAPP.createGame = function () {

    // Speeds things up a little
    MYAPP.game.renderer.clearBeforeRender = false;

    // Simple physics
    MYAPP.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Add background, tiling sprite
    MYAPP.game.add.tileSprite(0, 0, MYAPP.game.width, MYAPP.game.height, 'space');

    // Player sprite
    MYAPP.playerDolf = MYAPP.game.add.sprite(300, 300, 'ship');
    MYAPP.dolphinifySprite(MYAPP.playerDolf);

    // Input handling
    MYAPP.cursors = MYAPP.game.input.keyboard.createCursorKeys();

};

MYAPP.updateGame = function () {

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


};

MYAPP.renderGame = function () {

    // TODO

};

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
        { 
            preload : MYAPP.preloadGame,
            create  : MYAPP.createGame,
            update  : MYAPP.updateGame,
            render  : MYAPP.renderGame
        }
    );
