export interface CoffeeInventory {
    quantity: number;
    maxCapacity: number;
    minThreshold: number;
}

export interface WaterSystem {
    currentLevel: number;
    maxCapacity: number;
    minThreshold: number;
    isConnectedToSource: boolean;
}