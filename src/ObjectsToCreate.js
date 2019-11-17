import shapes from "./Shapes";
import { AU } from "./constants";
import { RedFormat } from "three";
export default {
  Sun: {
    type: shapes.sphere,
    dims: {
      radius: 695,
      widthSegments: 8,
      heightSegments: 6
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
      radius: 600,
      widthSegments: 8,
      heightSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x0000ff
  },
  EarthOrbit: {
    type: shapes.ellipse,
    dims: {
      width: AU,
      height: AU
    },
    color: 0xffffff
  },
  Mars: {
    type: shapes.sphere,
    dims: {
      radius: 6000,
      widthSegments: 8,
      heightSegments: 6
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0xff0000
  },
  MarsOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 1.38 * AU,
      width: 1.666 * AU
    },
    color: 0xf00f0f
  },
  // Mercury: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  MercuryOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 0.31 * AU,
      width: 0.47 * AU
    },
    color: 0x000fff
  },
  // Venus: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  VenusOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 0.718 * AU,
      width: 0.728 * AU
    },
    color: 0x00ffff
  },
  // Jupiter: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  JupiterOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 5.0 * AU,
      width: 5.46 * AU
    },
    color: 0xff0fff
  },
  // Saturn: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  SaturnOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 9.01 * AU,
      width: 9.01 * AU
    },
    color: 0xff00ff
  },
  // Uranus: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  UranusOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 18.4 * AU,
      width: 20.1 * AU
    },
    color: 0xff000f
  },
  // Neptune: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  NeptuneOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 29.81 * AU,
      width: 30.33 * AU
    },
    color: 0xf00000
  },
  // Ceres: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  CeresOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 2.5577 * AU,
      width: 2.9773 * AU
    },
    color: 0xfffff0
  },
  // Pallas: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  PallasOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 2.13061 * AU,
      width: 3.41261 * AU
    },
    color: 0xffff00
  },
  // Vesta: {
  //   type: shapes.sphere,
  //   dims: {
  //     radius: 6000,
  //     widthSegments: 8,
  //     heightSegments: 6
  //   },
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   color: 0xff0000
  // },
  VestaOrbit: {
    type: shapes.ellipse,
    dims: {
      height: 2.36 * AU,
      width: 2.36 * AU,
      OrbitalInclination: 5.58
    },
    color: 0xfff000
  }
};
