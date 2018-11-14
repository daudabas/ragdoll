const Matter = require('matter-js');

const ragdoll = (x, y, sc, options) => {
  const scale = typeof sc === 'undefined' ? 1 : sc;

  const {
    Body,
    Bodies,
    Constraint,
    Composite,
    Common,
  } = Matter;

  const headOptions = Common.extend({
    label: 'head',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    chamfer: {
      radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale],
    },
    render: {
      sprite: {
        texture: './img/head@2x.png',
      },
    },
  }, options);

  const chestOptions = Common.extend({
    label: 'chest',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    render: {
      sprite: {
        texture: './img/body@2x.png',
      },
    },
  }, options);

  const leftArmOptions = Common.extend({
    label: 'left-arm',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    chamfer: {
      radius: 10 * scale,
    },
    render: {
      sprite: {
        texture: './img/left_upper_arm@2x.png',
      },
    },
  }, options);

  const leftLowerArmOptions = Common.extend({
    chamfer: {
      radius: 10 * scale,
    },
  }, leftArmOptions, {
    render: {
      sprite: {
        texture: './img/left_forearm@2x.png',
      },
    },
  });

  const rightArmOptions = Common.extend({
    label: 'right-arm',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    chamfer: {
      radius: 10 * scale,
    },
    render: {
      sprite: {
        texture: './img/right_upper_arm@2x.png',
      },
    },
  }, options);

  const rightLowerArmOptions = Common.extend({
    chamfer: {
      radius: 10 * scale,
    },
  }, rightArmOptions, {
    render: {
      sprite: {
        texture: './img/right_forearm@2x.png',
      },
    },
  });

  const leftLegOptions = Common.extend({
    label: 'left-leg',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    render: {
      sprite: {
        texture: './img/left_thigh@2x.png',
      },
    },
  }, options);

  const leftLowerLegOptions = Common.extend({}, leftLegOptions, {
    render: {
      sprite: {
        texture: './img/left_foot@2x.png',
      },
    },
  });

  const rightLegOptions = Common.extend({
    label: 'right-leg',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    render: {
      sprite: {
        texture: './img/right_thigh@2x.png',
      },
    },
  }, options);

  const rightLowerLegOptions = Common.extend({}, rightLegOptions, {
    render: {
      sprite: {
        texture: './img/right_foot@2x.png',
      },
    },
  });

  const head = Bodies.rectangle(x, y - 270 * scale, 152 * scale, 163 * scale, headOptions);
  const chest = Bodies.rectangle(x, y, 98 * scale, 105 * scale, chestOptions);
  const rightUpperArm = Bodies.rectangle(x + 84 * scale, y - 41 * scale, 17 * scale, 40 * scale, rightArmOptions);
  const leftUpperArm = Bodies.rectangle(x - 84 * scale, y - 41 * scale, 17 * scale, 40 * scale, leftArmOptions);
  const rightLowerArm = Bodies.rectangle(x + 84 * scale, y + 40 * scale, 26 * scale, 64 * scale, rightLowerArmOptions);
  const leftLowerArm = Bodies.rectangle(x - 84 * scale, y + 40 * scale, 26 * scale, 64 * scale, leftLowerArmOptions);
  const leftUpperLeg = Bodies.rectangle(x - 50 * scale, y + 100 * scale, 21 * scale, 32 * scale, leftLegOptions);
  const rightUpperLeg = Bodies.rectangle(x + 50 * scale, y + 100 * scale, 21 * scale, 32 * scale, rightLegOptions);
  const leftLowerLeg = Bodies.rectangle(x - 68 * scale, y + 170 * scale, 38 * scale, 55 * scale, leftLowerLegOptions);
  const rightLowerLeg = Bodies.rectangle(x + 68 * scale, y + 170 * scale, 38 * scale, 55 * scale, rightLowerLegOptions);

  const headContraint = Constraint.create({
    bodyA: head,
    pointA: {
      x: -21,
      y: 155 * scale,
    },
    pointB: {
      x: -21,
      y: -115 * scale,
    },
    bodyB: chest,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const headContraint2 = Constraint.create({
    bodyA: head,
    pointA: {
      x: 21,
      y: 155 * scale,
    },
    pointB: {
      x: 21,
      y: -115 * scale,
    },
    bodyB: chest,
    stiffness: 0.8,
    render: {
      visible: false,
    },
  });

  const chestToRightUpperArm = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 84 * scale,
      y: -71 * scale,
    },
    pointB: {
      x: 0,
      y: -30 * scale,
    },
    bodyB: rightUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToRightUpperArm2 = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 75 * scale,
      y: -66 * scale,
    },
    pointB: {
      x: -9,
      y: -25 * scale,
    },
    bodyB: rightUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToLeftUpperArm = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -84 * scale,
      y: -71 * scale,
    },
    pointB: {
      x: 0,
      y: -30 * scale,
    },
    bodyB: leftUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToLeftUpperArm2 = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -75 * scale,
      y: -66 * scale,
    },
    pointB: {
      x: 9,
      y: -25 * scale,
    },
    bodyB: leftUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightArm = Constraint.create({
    bodyA: rightUpperArm,
    bodyB: rightLowerArm,
    pointA: {
      x: -5,
      y: 21 * scale,
    },
    pointB: {
      x: -5,
      y: -60 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightArm2 = Constraint.create({
    bodyA: rightUpperArm,
    bodyB: rightLowerArm,
    pointA: {
      x: 5,
      y: 21 * scale,
    },
    pointB: {
      x: 5,
      y: -60 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftArm = Constraint.create({
    bodyA: leftUpperArm,
    bodyB: leftLowerArm,
    pointA: {
      x: -5,
      y: 21 * scale,
    },
    pointB: {
      x: -5,
      y: -60 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftArm2 = Constraint.create({
    bodyA: leftUpperArm,
    bodyB: leftLowerArm,
    pointA: {
      x: 5,
      y: 21 * scale,
    },
    pointB: {
      x: 5,
      y: -60 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToLeftUpperLeg = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -50 * scale,
      y: 70 * scale,
    },
    pointB: {
      x: 0,
      y: -30 * scale,
    },
    bodyB: leftUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToLeftUpperLeg2 = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -60 * scale,
      y: 70 * scale,
    },
    pointB: {
      x: -10,
      y: -30 * scale,
    },
    bodyB: leftUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToRightUpperLeg = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 50 * scale,
      y: 70 * scale,
    },
    pointB: {
      x: 0,
      y: -30 * scale,
    },
    bodyB: rightUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToRightUpperLeg2 = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 60 * scale,
      y: 70 * scale,
    },
    pointB: {
      x: 10,
      y: -30 * scale,
    },
    bodyB: rightUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftLeg = Constraint.create({
    bodyA: leftUpperLeg,
    bodyB: leftLowerLeg,
    pointA: {
      x: 7,
      y: 20 * scale,
    },
    pointB: {
      x: 25,
      y: -50 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftLeg2 = Constraint.create({
    bodyA: leftUpperLeg,
    bodyB: leftLowerLeg,
    pointA: {
      x: -8,
      y: 20 * scale,
    },
    pointB: {
      x: 10,
      y: -50 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightLeg = Constraint.create({
    bodyA: rightUpperLeg,
    bodyB: rightLowerLeg,
    pointA: {
      x: -7,
      y: 20 * scale,
    },
    pointB: {
      x: -25,
      y: -50 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightLeg2 = Constraint.create({
    bodyA: rightUpperLeg,
    bodyB: rightLowerLeg,
    pointA: {
      x: 8,
      y: 20 * scale,
    },
    pointB: {
      x: -10,
      y: -50 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const legToLeg = Constraint.create({
    bodyA: leftLowerLeg,
    bodyB: rightLowerLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const person = Composite.create({
    bodies: [
      leftUpperLeg, rightUpperLeg, leftLowerLeg, rightLowerLeg,
      chest, head, rightUpperArm, leftUpperArm,
      rightLowerArm, leftLowerArm,
    ],
    constraints: [
      headContraint, headContraint2, chestToRightUpperArm,
      chestToLeftUpperArm, upperToLowerRightArm, upperToLowerLeftArm,
      upperToLowerLeftLeg2, upperToLowerRightLeg2,
      chestToRightUpperArm2, chestToLeftUpperArm2,
      upperToLowerRightArm2, upperToLowerLeftArm2,
      chestToLeftUpperLeg, chestToLeftUpperLeg2, chestToRightUpperLeg, chestToRightUpperLeg2, upperToLowerLeftLeg,
      upperToLowerRightLeg, legToLeg,
    ],
  });

  return person;
};

module.exports = ragdoll;
