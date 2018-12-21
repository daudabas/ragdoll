const Matter = require('matter-js');
const Ragdoll = require('./ragdoll');
const Snowflake = require('./snowflake');

const {
  Engine,
  Body,
  Render,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Events,
  Common,
  Composite,
  Vector,
} = Matter;

export default class ElfWorld {
  constructor(headURL, maxSnowflakes, headTappedCallback) {
    this.snowflakes = [];
    this.headURL = headURL;
    this.ragdoll = null;
    this.maxSnowflakes = maxSnowflakes || 500;
    this.headTappedCallback = headTappedCallback;

    this.createEngine();
    this.createRender();
  }

  createEngine() {
    this.engine = Engine.create();
  }

  createRender() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { engine } = this;
    const rootDiv = document.getElementById('root');
    this.render = Render.create({
      element: rootDiv,
      engine,
      options: {
        wireframes: false,
        background: 'transparent',
        width,
        height
      },
    });
  }

  loadMouse() {
    const mouse = Mouse.create(this.render.canvas);

    const options = {
      mouse,
      constraint: {
        stiffness: 0.6,
        length: 0,
        angularStiffness: 0,
        render: {
          visible: false,
        },
      },
    };

    this.mouseConstraint = MouseConstraint.create(this.engine, options);
    World.add(this.engine.world, this.mouseConstraint);
    this.render.mouse = mouse;
  }

  loadBodies() {
    const canvasHeight = this.render.canvas.height;
    const canvasWidth = this.render.canvas.width;
    this.ground = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 20, { isStatic: true, render: { visible: false } });
    this.leftWall = Bodies.rectangle(-100, canvasHeight / 2, 200, canvasHeight, { isStatic: true, render: { visible: false } });
    this.rightWall = Bodies.rectangle(canvasWidth + 100, canvasHeight / 2, 200, canvasHeight, { isStatic: true, render: { visible: false } });
    this.ceiling = Bodies.rectangle(canvasWidth / 2, 10 - 100, canvasWidth, 200, { isStatic: true, render: { visible: false } });

    this.ragdoll = Ragdoll(this.headURL, canvasWidth / 2, canvasHeight - 350, 1, { frictionAir: 0 });

    World.add(this.engine.world, [this.ground,this.leftWall, this.rightWall, this.ceiling, this.ragdoll]);
  }

  addSnow() {
    if (this.snowflakes.length < this.maxSnowflakes) {
      for (let i = 0; i < 10; i += 1) {
        const random = Math.random();
        const x = (random * 1000) % this.render.canvas.width;
        const y = ((random * 1000) % 100) + 10;
        const snowFlake = Snowflake(x, y, 2);
        this.snowflakes.push(snowFlake);
        World.add(this.engine.world, snowFlake);
      }
    }
  }

  loadEvents() {
    this.isDragging = false;
    this.isHeadTapped = false;

    Events.on(this.mouseConstraint, 'mouseup', () => {
      if (this.isDragging === false && this.isHeadTapped === false) {
        this.addSnow();
      } else if (this.isHeadTapped === true) {
        this.headTappedCallback();
        this.isHeadTapped = false;
      } else {
        this.isDragging = false;
      }
    });

    Events.on(this.mouseConstraint, 'mousedown', () => {
      const { body } = this.mouseConstraint;
      if (body !== null && body.label === 'head') {
        this.isHeadTapped = true;
        this.isDragging = false;
      } else {
        this.isHeadTapped = false;
      }
    });

    Events.on(this.mouseConstraint, 'startdrag', () => {
      this.isDragging = true;
    });
  }

  updateGravity(event) {
    const { orientation } = window;
    const { gravity } = this.engine.world;

    if (orientation === 0) {
      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
      gravity.y = Common.clamp(event.beta, -90, 90) / 90;
    } else if (orientation === 180) {
      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
      gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
    } else if (orientation === 90) {
      gravity.x = Common.clamp(event.beta, -90, 90) / 90;
      gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
    } else if (orientation === -90) {
      gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
      gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
    }
  }

  removeSnowflake() {
    const size = this.snowflakes.length < 10 ? this.snowflakes.length : 10;
    const snowFlakesToRemove = [];
    console.log(size);
    for (let i = 0; i < size; i++) {
      snowFlakesToRemove.push(this.snowflakes[i]);
      Composite.remove(this.engine.world, this.snowflakes[i]);
    }

    for (let i = 0; i < size; i++) {
      this.snowflakes.shift();
    }
  }

  randomImpulse() {
    const size = this.snowflakes.length;
    for (let i = 0; i < size; i += 1) {
      const xForce = (Math.random() - 0.5) % 0.001;
      const yForce = Math.random() % 0.001;
      const snowFlake = this.snowflakes[i];
      Body.applyForce(snowFlake, Vector.create(snowFlake.x, snowFlake.y), Vector.create(xForce, yForce));
    }
    const chest = this.ragdoll.bodies[4];

    const xForce = Math.random();
    const yForce = Math.random();
    Body.applyForce(chest, Vector.create(chest.x, chest.y), Vector.create(xForce, yForce));
  }

  init() {
    this.loadBodies();
    this.loadMouse();
    this.loadEvents();

    Engine.run(this.engine);
    Render.run(this.render);

    // this.interval = setInterval(this.removeSnowflake.bind(this), 10000);
  }

  reset() {
    this.snowflakes.forEach(snowflake => {
      Composite.remove(this.engine.world, snowflake);
    });

    this.snowflakes = [];

    World.remove(this.engine.world, this.mouseConstraint);
    World.remove(this.engine.world, this.ground);
    World.remove(this.engine.world, this.leftWall);
    World.remove(this.engine.world, this.rightWall);
    World.remove(this.engine.world, this.ceiling);
    World.remove(this.engine.world, this.mouseConstraint);
    
    Composite.remove(this.engine.world, this.ragdoll);

    this.loadBodies();
    World.add(this.engine.world, this.mouseConstraint);
  }

  stop() {
    // clearInterval(this.interval);

    this.snowflakes.forEach(snowflake => {
      Composite.remove(this.engine.world, snowflake);
    });

    this.snowflakes = [];


    World.remove(this.engine.world, this.mouseConstraint);
    World.remove(this.engine.world, this.ground);
    World.remove(this.engine.world, this.leftWall);
    World.remove(this.engine.world, this.rightWall);
    World.remove(this.engine.world, this.ceiling);
    
    Composite.remove(this.engine.world, this.ragdoll);

    Render.stop(this.render);
    World.clear(this.engine.world);
    Engine.clear(this.engine);
    this.render.canvas.remove();

    this.render.canvas = null;
    this.render.context = null;
  }
}