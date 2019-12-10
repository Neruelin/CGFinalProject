import shapes from "./Shapes";
import { AU } from "./constants";
import { Vector3 } from "three";
export const Orbits = {
  Earth: {
    type: shapes.ellipse,
    dims: {
      aphelion: AU,
      perihelion: AU,
      OrbitalInclination: 0,
      period: 1.0,
      eccentricity: 0.017
    },
    color: 0xffffff
  },
  Mars: {
    type: shapes.ellipse,
    dims: {
      perihelion: 1.38 * AU,
      aphelion: 1.666 * AU,
      OrbitalInclination: 1.85,
      period: 1.88,
      eccentricity: 0.094
    },
    color: 0xf00f0f
  },
  Mercury: {
    type: shapes.ellipse,
    dims: {
      perihelion: 0.31 * AU,
      aphelion: 0.47 * AU,
      OrbitalInclination: 7.01,
      period: 0.241,
      eccentricity: 0.205
    },
    color: 0x000fff
  },
  Venus: {
    type: shapes.ellipse,
    dims: {
      perihelion: 0.718 * AU,
      aphelion: 0.728 * AU,
      OrbitalInclination: 3.39,
      period: 0.615,
      eccentricity: 0.007
    },
    color: 0x00ffff
  },
  Jupiter: {
    type: shapes.ellipse,
    dims: {
      perihelion: 5.0 * AU,
      aphelion: 5.46 * AU,
      OrbitalInclination: 1.31,
      period: 11.86,
      eccentricity: 0.049
    },
    color: 0xff0fff
  },
  Saturn: {
    type: shapes.ellipse,
    dims: {
      perihelion: 9.01 * AU,
      aphelion: 9.01 * AU,
      OrbitalInclination: 2.49,
      period: 457.0,
      eccentricity: 0.057
    },
    color: 0xff00ff
  },
  Uranus: {
    type: shapes.ellipse,
    dims: {
      perihelion: 18.4 * AU,
      aphelion: 20.1 * AU,
      OrbitalInclination: 0.77,
      period: 84.0,
      eccentricity: 0.046
    },
    color: 0xff000f
  },
  Neptune: {
    type: shapes.ellipse,
    dims: {
      perihelion: 29.81 * AU,
      aphelion: 30.33 * AU,
      OrbitalInclination: 1.77,
      period: 164.8,
      eccentricity: 0.011
    },
    color: 0xf00000
  },
  Ceres: {
    type: shapes.ellipse,
    dims: {
      perihelion: 2.5577 * AU,
      aphelion: 2.9773 * AU,
      OrbitalInclination: 10.62,
      period: 4.6,
      eccentricity: 0.08
    },
    color: 0xfffff0
  },
  Pallas: {
    type: shapes.ellipse,
    dims: {
      perihelion: 2.13061 * AU,
      aphelion: 3.41261 * AU,
      OrbitalInclination: 35.06,
      period: 4.6,
      eccentricity: 0.2305
    },
    color: 0xffff00
  },
  Vesta: {
    type: shapes.ellipse,
    dims: {
      perihelion: 2.15 * AU,
      aphelion: 2.57 * AU,
      OrbitalInclination: 5.58,
      period: 3.6,
      eccentricity: 0.09
    },
    color: 0xfff000
  },
  Pluto: {
    type: shapes.ellipse,
    dims: {
      perihelion: 29.7 * AU,
      aphelion: 49.3 * AU,
      OrbitalInclination: 17,
      period: 248,
      eccentricity: 0.244
    },
    color: 0xf0f0f0
  }
};
export const SpaceObjects = {
  Sun: {
    texture: "./assets/textures/2k_sun.jpg",
    type: shapes.sphere,
    dims: {
      mass: 1989000000000000000000000000000,
      actualRadius: 695.51,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.127,
    day: 2116800,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xffff00
  },
  Earth: {
    type: shapes.sphere,
    texture: "./assets/textures/earth_8k.jpg",
    dims: {
      mass: 5970000000000000000000000,
      actualRadius: 6.371,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.409,
    day: 86400,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x0000ff
  },
  Mars: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_mars.jpg",
    dims: {
      mass: 642000000000000000000000,
      actualRadius: 3.3895,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.440,
    day: 90000,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  Mercury: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_mercury.jpg",
    dims: {
      mass: 330000000000000000000000,
      actualRadius: 2.4397,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.001,
    day: 5068800,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  Venus: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_venus.jpg",
    dims: {
      mass: 4870000000000000000000000,
      actualRadius: 6.0518,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.046,
    day: 20995200,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  Jupiter: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_jupiter.jpg",
    dims: {
      mass: 1898000000000000000000000000,
      actualRadius: 69.911,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.055,
    day: 36000,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  Saturn: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_saturn.jpg",
    dims: {
      mass: 568000000000000000000000000,
      actualRadius: 58.232,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.467,
    day: 39600,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000,
    rings: {
      innerRad: 59,
      outerRad: 137,
      texture: "./assets/textures/top_down_rings.PNG"
    }
  },
  Uranus: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_uranus.jpg",
    dims: {
      mass: 86800000000000000000000000,
      actualRadius: 25.362,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 1.435,
    day: 61200,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  Neptune: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_neptune.jpg",
    dims: {
      mass: 102000000000000000000000000,
      actualRadius: 24.622,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.494,
    day: 57600,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xf00f0f
  },

  Ceres: {
    type: shapes.sphere,
    texture: "./assets/textures/2k_ceres.jpg",
    dims: {
      mass: 895800000000000000000,
      actualRadius: 0.473,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.183,
    day: 145324800,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x00ff00
  },

  Pallas: {
    type: shapes.sphere,
    texture: "./assets/textures/asteroid.jpg",
    dims: {
      mass: 210800000000000000000,
      actualRadius: 0.2725,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.607,
    day: 145065600,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff00f0
  },

  Vesta: {
    type: shapes.sphere,
    texture: "./assets/textures/asteroid.jpg",
    dims: {
      mass: 258900000000000000000,
      actualRadius: 0.2627,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 0.4,
    day: 113529600,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xf0f000
  },
  Pluto: {
    type: shapes.sphere,
    texture: "./assets/textures/pluto.png",
    dims: {
      mass: 14600000000000000000000,
      actualRadius: 1.188,
      widthSegments: 32,
      heightSegments: 32
    },
    tilt: 1.003,
    day: 552096,
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x0000ff
  },
  // Moon: {
  //   type: shapes.sphere,
  //   texture: "./assets/textures/8k_moon.jpg",
  //   dims: {
  //     actualRadius: 1.7371,
  //     widthSegments: 32,
  //     heightSegments: 32
  //   },
  //   tilt: 0,
  //   day: 2332800,
  //   pos: {
  //     x: 10000000,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0x0000ff
  // },
};

export const PhysicsObjects = {
  Probe1: {
    type: shapes.cube,
    dims: {
      size: 30,
      actualRadius: 30,
      radius: 30,
      mass: 500
    },
    velocity: new Vector3(0, 0, 500000),
    pos: {
      x: AU,
      y: 0,
      z: 0
    },
    color: 0x00ff00
  },
  Probe5: {
    type: shapes.cube,
    dims: {
      size: 30,
      actualRadius: 30,
      radius: 30,
      mass: 500
    },
    velocity: new Vector3(0, 300000, 0),
    pos: {
      x: AU,
      y: 0,
      z: 0
    },
    color: 0x00ffff
  },
  RocketshipsAndButterflies: {
    type: shapes.cube,
    dims: {
      size: 30,
      actualRadius: 30,
      radius: 30,
      mass: 500
    },
    velocity: new Vector3(0, 0, 100000),
    pos: {
      x: AU,
      y: 0,
      z: 0
    },
    color: 0x0000ff
  },
  ToInfinityAndBeyond: {
    type: shapes.cube,
    dims: {
      size: 30,
      actualRadius: 30,
      radius: 30,
      mass: 500
    },
    velocity: new Vector3(0, 0, 10000),
    pos: {
      x: AU,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  Probe4: {
    type: shapes.cube,
    dims: {
      size: 30,
      actualRadius: 30,
      radius: 30,
      mass: 500
    },
    velocity: new Vector3(0, 0, 1000000),
    pos: {
      x: AU,
      y: 0,
      z: 0
    },
    color: 0xff00ff
  }
};