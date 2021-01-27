import healthBar from './healthBar.js';

class healthBarPlugin extends Phaser.Plugins.ScenePlugin {

    constructor(scene, pluginManager) {
        super(scene, pluginManager);
        this.scene = scene;
    }

    add(gameObject, config) {
        var eventEmitter = this.game.events;
        eventEmitter.once('destroy', this.destroy, this);
        eventEmitter.on('step', this.update, this);

        this.healthBarGroup = this.scene.add.group({
            classType: healthBar,
            runChildUpdate: true
        });

        let bar = new healthBar(this.scene, gameObject, config);

        this.healthBarGroup.add(bar);

        return bar;
    }

    update () {

    }

    destroy() {
        this.game.events.off('step', this.update, this);
        super.destroy();
    }
}
export default healthBarPlugin;