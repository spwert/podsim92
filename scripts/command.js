MYAPP.Command = Object.create(null);
MYAPP.Command.prototype = {
    execute: function () {
        throw {
            name: "NotImplementedException",
            message: this.constructor.name + ": execute() not implemented"
        };
    }
};

// Dolphin commands
// TODO: separate acceleration and direction commands? handle different states?
MYAPP.DDirCommand = Object.create(MYAPP.Command.prototype);
MYAPP.DDirCommand.prototype = {
    execute : function (target) {
        var rotation = 0;

        // Set rotation based on direction
        switch (this.dir) {
            case "U":
                rotation = -Math.PI / 2;
                break;
            case "UR":
                rotation = -Math.PI / 4;
                break;
            case "R":
                rotation = 0;
                break;
            case "DR":
                rotation = Math.PI / 4;
                break;
            case "D":
                rotation = Math.PI / 2;
                break;
            case "DL":
                rotation = Math.PI * 3 / 4;
                break;
            case "L":
                rotation = Math.PI;
                break;
            case "UL":
                rotation = -Math.PI * 3 / 4;
                break;
            default:
                // handle anything else as nothing
                target.body.acceleration.set(0);
                return;
        }

        // Rotate sprite and change velocity
        Phaser.Point.rotate(
            target.body.velocity,
            0,
            0,
            rotation - target.rotation
        );
        // TODO: why this line? redundant?
        target.rotation = rotation;
        MYAPP.game.physics.arcade.accelerationFromRotation(
            target.rotation,
            MYAPP.DOLF_ACC,
            target.body.acceleration
        );
    }
};
