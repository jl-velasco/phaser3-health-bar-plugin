import Phaser from "phaser";

/**
 * @author       Jorge Velasco <jorge.zgz@gmail.com>
 * @license      {@link https://github.com/jl-velasco/phaser3-health-bar-plugin/blob/master/LICENSE|MIT License}
 */

class healthBarPlugin extends Phaser.GameObjects.Graphics {

    constructor(scene, gameObject, options) {
        super(scene);
        this.gameObject = gameObject;
        this.x = this.gameObject.x - (this.gameObject.width / 2);
        this.y = this.gameObject.y - (this.gameObject.height / 2);
        this.scene = scene;
        this.options = {
            width: 30,
            height: 7,
            font: {
                font: "20px monospace",
                fill: "#fff"
            },
            foreground: '0x8fff00',
            background: '0x000000',
            danger: '0xBF9000',
            nameBar: null,
        };

        this._setupOptions(options);
        this.boot();
        this.setDepth(10);
        this.scene.add.existing(this);
        this.setActive(true);
    }

    _setupOptions(options) {
        for (var option in this.options) {
            if (option in options) {
                this.options[option] = options[option];
            }
        }
    };

    boot() {
        var gameObject = this.gameObject;

        this.clear();

        this.fillStyle(this.options.background);
        this.fillRect(0, 0, this.options.width, this.options.height);

        this.fillStyle(this.options.foreground);
        this.fillRect(2, 2, this.options.width - 4, this.options.height - 4);

        this.tweenBar = this.scene.tweens.add({
            targets: this,
            x: this.x,
            y: this.y,
            paused: false,
            duration: 10000,
            repeatDelay: 0
        });

        if (this.options.nameBar) {
            this.nameBar = this.scene.add.text(this.x, this.y, this.options.nameBar);
            this.nameBar.setFontSize(9);
            this.tweenText = this.scene.tweens.add({
                targets: this.nameBar,
                x: this.x,
                y: this.y - this.options.height - 3,
                paused: false,
                duration: 10000,
                repeatDelay: 0
            });
        }

        gameObject.on('destroy', this.destroy, this);

        return;
    }

    preUpdate(time, delta) {
    }

    update(time, delta) {

        if (!this.gameObject) {
            return;
        }

        this.barMoveTo();
        this.textMoveTo();

        if (this.gameObject.health === this.oldHealth) {
            return;
        }

        this.updateBar();
        this.updateText();
        this.damage();

        this.oldHealth = this.gameObject.health;

        if (this.gameObject.health <= 0) {
            this.gameObject.destroy();
        }
    }

    //  Called every Scene step - phase 3
    postUpdate(time, delta) {
    }

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause() {
    }

    //  Called when a Scene is resumed from a paused state.
    resume() {
    }

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep() {
    }

    //  Called when a Scene is woken from a sleeping state.
    wake() {
    }

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown() {
    }

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        this.clear();
        // this.nameBar.setVisible(false);
        this.shutdown();
        this.scene = undefined;
    }

    updateText() {

    };


    updatePercent() {
    };

    updateBar() {
        this.clear();

        this.fillStyle(this.options.background);
        this.fillRect(0, 0, this.options.width + 4, this.options.height);


        if (this.gameObject.health < 40) {
            this.fillStyle(this.options.danger);
        } else {
            this.fillStyle(this.options.foreground);
        }

        var d = Math.floor(((this.options.width) / 100) * this.gameObject.health);

        this.fillRect(2, 2, d, this.options.height - 4);
    }

    damage() {
        const gameObject = this.gameObject;
        if (this.oldHealth > gameObject.health) {
            let dmg = this.oldHealth - gameObject.health;
            let text = this.scene.add.text(gameObject.x - (gameObject.width / 2) - 3, gameObject.y - (gameObject.height / 2) - 3, '-' + dmg);
            text.setFontFamily('retro');
            text.setFontSize(9);
            text.setTint(0xB80A0A);

            this.scene.tweens.add({
                targets: text,
                x: gameObject.x - (gameObject.width / 2) - 3,
                y: gameObject.y - (gameObject.height / 2) - 3 - 40,
                duration: Phaser.Math.Between(500, 1000),
                ease: 'Power1',
                onComplete: function () {
                    text.destroy();
                }
            });

            this.scene.tweens.addCounter({
                targets: gameObject,
                duration: 500,
                onUpdate: function (tween)
                {
                    // gameObject.setTint(0xCC0000, 0xF9CB9C, 0xF9CB9C, 0xCC0000);
                    gameObject.setTintFill(0xCC0000, 0xF9CB9C, 0xF9CB9C, 0xCC0000);
                    gameObject.setAlpha(0.7);
                    gameObject.setScale(0.85);
                },
                onComplete: function (tween)
                {
                    gameObject.clearTint();
                    gameObject.setAlpha(1);
                    gameObject.setScale(1);
                }
            })
        }
    }

    healthPrint() {
        return this.gameObject.health + ' / ' + this.gameObject.maxHealth;
    };

    barMoveTo() {
        const {scene} = this;

        if (!this.tweenBar.isPlaying()) {
            this.tweenBar.play();
        }

        this.tweenBar.updateTo('x', this.gameObject.x - (this.gameObject.width / 2) - 3, true);
        this.tweenBar.updateTo('y', this.gameObject.y - (this.gameObject.height / 2) - 3, true);
    }

    textMoveTo() {
        const {scene} = this;
        if (this.options.nameBar) {
            if (!this.tweenText.isPlaying()) {
                this.tweenText.play();
            }

            this.tweenText.updateTo('x', this.x, true);
            this.tweenText.updateTo('y', this.y - this.options.height - 3, true);
        }
    }

};

export default healthBarPlugin;
