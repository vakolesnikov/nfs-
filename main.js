let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

let app = new Application({
        width: 400,
        height: 800,
        antialias: true,
        transparent: false,
        resolution: 1,
        backgroundColor: 0xefefef,
    }
);

document.body.appendChild(app.view);

loader
    .add([
        "images/car.png",
        "images/carEnemy.png",
        "images/way.png",
    ])
    .load(setup);

let car, background, background2;
let carsEnemy = [];

function setup() {
    background = new PIXI.extras.TilingSprite(resources["images/way.png"].texture, app.screen.width, app.screen.height +1);
    background2 = new PIXI.extras.TilingSprite(resources["images/way.png"].texture, app.screen.width, app.screen.height +1);

    background.vy = 5;
    background2.vy = 5;

    background.y = 0;
    background2.y = -app.screen.height;

    car = new Sprite(resources["images/car.png"].texture);

    car.x = 140;
    car.y = app.screen.height - 80;

    car.anchor.x = 0.5;

    car.vx = 0;
    car.vy = 0;

    carsEnemy.push(generateCar());
    setInterval(() => carsEnemy.push(generateCar()), 700);


    app.stage.addChild(background);
    app.stage.addChild(background2);
    app.stage.addChild(car);


    setInterval(() => carsEnemy.forEach(car => app.stage.addChild(car)), 700);
    setInterval(() => carsEnemy.unshift(), 700);

    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");
    left.press = () => car.vx = -5;

    left.release = () => car.vx = 0;
    up.press = () => car.vy = -5;

    up.release = () => car.vy = 0;
    right.press = () => car.vx = 5;

    right.release = () => car.vx = 0;
    down.press = () => car.vy = 5;

    down.release = () => car.vy = 0;


    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(){
    const maxLeft = 15;
    const maxRight = app.screen.width - 15;
    const maxUp = 0;
    const maxDown = app.screen.height - 60;

    if (background.y >= app.screen.height) background.y = -app.screen.height;
    if (background2.y >= app.screen.height) background2.y = -app.screen.height;


    if (car.x + car.vx > maxLeft && car.x + car.vx < maxRight) {
        car.x += car.vx;
    }

    if (car.y + car.vy > maxUp && car.y + car.vy < maxDown) {
        car.y += car.vy;
    }

    carsEnemy.forEach(car => car.y += car.vy);


    background.y += background.vy;
    background2.y += background2.vy;
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };


    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener("keydown", downListener);
    window.addEventListener("keyup", upListener);

    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

function generateCar() {
    const index = Math.floor(Math.random() * 4);
    const speed = Math.floor(Math.random() * 7 + 5);

    const indexs = [10, 115, 230, 330];

    const newCar = new Sprite(resources["images/carEnemy.png"].texture);

    newCar.x = indexs[index];
    newCar.y = -80;
    newCar.vy = speed;

    return newCar;
}