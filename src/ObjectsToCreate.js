import shapes from "./Shapes";
import { AU } from "./constants";
// import { RedFormat } from "three";
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
      period: 4.6
    },
    color: 0xfffff0
  },
  Pallas: {
    type: shapes.ellipse,
    dims: {
      perihelion: 2.13061 * AU,
      aphelion: 3.41261 * AU,
      OrbitalInclination: 35.06,
      period: 4.6
    },
    color: 0xffff00
  },
  Vesta: {
    type: shapes.ellipse,
    dims: {
      perihelion: 2.15 * AU,
      aphelion: 2.57 * AU,
      OrbitalInclination: 5.58,
      period: 3.6
    },
    color: 0xfff000
  }
  // Pluto: {
  //   type: shapes.ellipse,
  //   dims: {
  //     perihelion:,
  //     aphelion:,
  //     OrbitalInclination:,
  //     period:,
  //     eccentricity: 0.244
  //   },
  //   color: 0xf0f0f0
  // },
};
export const SpaceObjects = {
  Sun: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xffff00
  },
  Earth: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x0000ff
  },
  Mars: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  Mercury: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },

  Venus: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },

  Jupiter: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },

  Saturn: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },

  Uranus: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },

  Neptune: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xf00f0f
  },

  Ceres: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x00ff00
  },

  Pallas: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff00f0
  },

  Vesta: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      aphelionSegments: 8,
      perihelionSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xf0f000
  }
};
