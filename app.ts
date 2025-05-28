import * as readline from 'readline';
import { CoffeeMachine } from './src/coffeeMachine';

class CoffeeMachineCLI {
    private machine: CoffeeMachine;
    private rl: readline.Interface;

    constructor() {
        this.machine = new CoffeeMachine();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    }

    public async testMachine(): Promise<void> {
        const coffeeTypes = this.machine.getCoffeeTypes();
        const payment = 5.00;

        try {
            this.machine.setPower(true);
            this.machine.connectWaterSource();

            console.log('Available coffees:');
            coffeeTypes.forEach((coffee, i) => {
                console.log(`${i + 1}. ${coffee.name} - $${coffee.price}`);
            });

            const coffeeChoice = await this.askQuestion('Select coffee (1-4): ');
            const coffeeIndex = parseInt(coffeeChoice) - 1;

            if (isNaN(coffeeIndex) || coffeeIndex < 0 || coffeeIndex >= coffeeTypes.length) {
                console.log('Invalid selection!');
                this.rl.close();
                return;
            }

            const testCoffee = coffeeTypes[coffeeIndex];
            const result = this.machine.brewCoffee(testCoffee, payment);
            console.log(result);

            console.log('\nMachine status:');
            console.log(this.machine.getStatus());

        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            this.rl.close();
        }
    }
}

const cli = new CoffeeMachineCLI();
cli.testMachine().catch(console.error);