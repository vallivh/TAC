import Phaser from 'phaser'

export default class Card extends Phaser.GameObjects.Image {

    constructor (scene, x, y, key)
    {
        super(scene, x, y, key);

        this.setTexture(key);
        this.setPosition(x, y);
        this.setScale(0.22);
        this.setInteractive();
        scene.input.setDraggable(this);
    }
}

Phaser.GameObjects.GameObjectFactory.register('card', function (x, y, key)
{
    return this.displayList.add(new Card(this.scene, x, y, key))
});