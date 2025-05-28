import {CoffeeType, Inventory, MachineError} from './model/coffeeTypes';
import {CoffeeInventory, WaterSystem } from './model/coffeeInterface';

export class CoffeeMachine {
    private coffee: CoffeeInventory
    private waterSystem: WaterSystem;
    private powerAvailable: boolean;
    private error: MachineError | null;
    private coffeeTypes: CoffeeType[];

    constructor() {
        this.coffee = {
            quantity: 100,
            maxCapacity: 1000,
            minThreshold: 50
        }
        this.waterSystem = {
            currentLevel: 500,
            maxCapacity: 2000,
            minThreshold: 100,
            isConnectedToSource: false
        };
        this.powerAvailable = true;
        this.error = null;
        this.coffeeTypes = [
            { name: "Espresso", coffeeRequired: 10, waterRequired: 30, price: 2.50 },
            { name: "Americano", coffeeRequired: 10, waterRequired: 150, price: 3.00 },
            { name: "Latte", coffeeRequired: 15, waterRequired: 200, price: 4.00 },
            { name: "Cappuccino", coffeeRequired: 15, waterRequired: 180, price: 3.50 }
        ];
    }

    public getCoffeeTypes(): CoffeeType[] {
        return this.coffeeTypes;
    }
    
    public checkCoffeeLevel(): number {
        return this.coffee.quantity;
    }
    public addCoffee(amount: number): void {
        if (this.checkCoffeeLevel() + amount > this.coffee.maxCapacity) {
            throw new Error("Cannot add more coffee than max capacity");
        }
        this.coffee.quantity += amount;
    }

    public refillCoffee(): void {
        const amountToRefill = this.coffee.maxCapacity - this.coffee.quantity;
        this.addCoffee(amountToRefill);
        console.log(`Coffee refilled! Current level: ${this.coffee.quantity}g`);
    }

    public connectWaterSource(): void {
        if (!this.waterSystem.isConnectedToSource) {
            this.waterSystem.isConnectedToSource = true;
            console.log("Water source connected!");
        } else {
            throw new Error("Water source is already connected");
        }
    }

    public disconnectWaterSource(): void {
        if (this.waterSystem.isConnectedToSource) {
            this.waterSystem.isConnectedToSource = false;
            console.log("Water source disconnected!");
        } else {
            throw new Error("Water source is not connected");
        }
    }

    public checkWaterLevel(): number {
        return this.waterSystem.currentLevel;
    }

    public refillWater(): void {
        const amountToRefill = this.waterSystem.maxCapacity - this.waterSystem.currentLevel;
        this.waterSystem.currentLevel = this.waterSystem.maxCapacity;
        console.log(`Water refilled! Current level: ${this.waterSystem.currentLevel}ml`);
    }

    public checkPower(): boolean {
        return this.powerAvailable;
    }

    public setPower(status: boolean): void {
        this.powerAvailable = status;
        console.log(`Power ${status ? 'ON' : 'OFF'}`);
    }

    public getStatus(): string {
        return `
        === Coffee Machine Status ===
        Power: ${this.powerAvailable ? 'ON' : 'OFF'}
        Coffee: ${this.coffee.quantity}g / ${this.coffee.maxCapacity}g
        Water: ${this.waterSystem.currentLevel}ml / ${this.waterSystem.maxCapacity}ml
        Water Source: ${this.waterSystem.isConnectedToSource ? 'Connected' : 'Disconnected'}
        Error: ${this.error || 'None'}
        `;
    }

    public brewCoffee(coffeeType: CoffeeType, payment: number): string {
        this.error = null;

        if (!this.checkPower()) {
            this.error = MachineError.PowerOutage;
            throw new Error(this.error);
        }

        if (payment < coffeeType.price) {
            this.error = MachineError.InsufficientFunds;
            throw new Error(`${this.error}. Required: $${coffeeType.price.toFixed(2)}, Provided: $${payment.toFixed(2)}`);
        }

        if (this.checkCoffeeLevel() < coffeeType.coffeeRequired) {
            this.error = MachineError.InsufficientCoffee;
            throw new Error(this.error);
        }

        if (!this.waterSystem.isConnectedToSource && this.checkWaterLevel() < coffeeType.waterRequired) {
            this.error = MachineError.InsufficientWater;
            throw new Error(this.error);
        }

        this.coffee.quantity -= coffeeType.coffeeRequired;
        if (!this.waterSystem.isConnectedToSource) {
            this.waterSystem.currentLevel -= coffeeType.waterRequired;
        }

        const change = payment - coffeeType.price;
        return `☕ ${coffeeType.name} brewed successfully! Change: $${change.toFixed(2)}`;
    }

}