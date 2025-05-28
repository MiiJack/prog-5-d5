export type Inventory = {
    coffee: number;
    water: number;
}

export enum MachineError {
    InsufficientFunds = "Insufficient funds",
    InsufficientCoffee = "Insufficient coffee, please refill",
    InsufficientWater = "Insufficient water, please refill",
    PowerOutage = "Power outage",
}

export type CoffeeType = {
    name: string;
    coffeeRequired: number;
    waterRequired: number;
    price: number;
}