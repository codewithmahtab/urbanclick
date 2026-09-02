export const categoryFilters = {
  shoes: ["size", "color", "material", "gender"],

  "men-shoes": ["size", "color", "material"],
  "women-shoes": ["size", "color", "material"],

  "t-shirts": ["size", "color", "material", "fit"],
  "men-clothing": ["size", "color", "material", "fit"],
  "women-clothing": ["size", "color", "material", "fit"],

  laptops: ["ram", "storage", "processor", "screenSize"],

  mobiles: ["ram", "storage", "screenSize", "camera", "battery"],

  headphones: ["type", "connectivity", "noiseCancellation", "batteryLife"],

  "smart-watches": ["displaySize", "batteryLife", "connectivity"],
} as const;

export const filterLabels: Record<string, string> = {
  size: "Size",
  color: "Color",
  material: "Material",
  gender: "Gender",
  fit: "Fit",

  ram: "RAM",
  storage: "Storage",
  processor: "Processor",
  screenSize: "Screen Size",
  camera: "Camera",
  battery: "Battery",

  type: "Type",
  connectivity: "Connectivity",
  noiseCancellation: "Noise Cancellation",
  batteryLife: "Battery Life",

  displaySize: "Display Size",
};
