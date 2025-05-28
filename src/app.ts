import * as readline from 'readline';
import { CoffeeMachine } from './coffeeMachine';	

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

    private showMenu(): void {
        console.log('\n=== Coffee Machine CLI ===');
        console.log('1. View coffee menu');
        console.log('2. Buy coffee');
        console.log('3. Check status');
        console.log('4. Refill coffee');
        console.log('5. Refill water');
        console.log('6. Connect/Disconnect water source');
        console.log('7. Toggle power');
        console.log('8. Exit');
        console.log('========================\n');
    }

    private showCoffeeMenu(): void {
        console.log('\n=== Coffee Menu ===');
        const coffeeTypes = this.machine.getCoffeeTypes();
        coffeeTypes.forEach((coffee, index) => {
            console.log(`${index + 1}. ${coffee.name} - $${coffee.price.toFixed(2)}`);
        });
        console.log('==================\n');
    }

    private async buyCoffee(): Promise<void> {
        this.showCoffeeMenu();
        
        const coffeeChoice = await this.askQuestion('Select coffee (1-4): ');
        const coffeeIndex = parseInt(coffeeChoice) - 1;
        const coffeeTypes = this.machine.getCoffeeTypes();
        
        if (coffeeIndex < 0 || coffeeIndex >= coffeeTypes.length) {
            console.log('Invalid selection!');
            return;
        }

        const selectedCoffee = coffeeTypes[coffeeIndex];
        console.log(`Selected: ${selectedCoffee.name} - $${selectedCoffee.price.toFixed(2)}`);
        
        const paymentStr = await this.askQuestion('Enter payment amount: $');
        const payment = parseFloat(paymentStr);
        
        if (isNaN(payment) || payment <= 0) {
            console.log('Invalid payment amount!');
            return;
        }

        try {
            const result = this.machine.brewCoffee(selectedCoffee, payment);
            console.log(result);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    private async toggleWaterSource(): Promise<void> {
        const choice = await this.askQuestion('Connect (c) or Disconnect (d) water source? ');
        try {
            if (choice.toLowerCase() === 'c') {
                this.machine.connectWaterSource();
            } else if (choice.toLowerCase() === 'd') {
                this.machine.disconnectWaterSource();
            } else {
                console.log('Invalid choice!');
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    private async togglePower(): Promise<void> {
        const choice = await this.askQuestion('Turn power ON (on) or OFF (off)? ');
        if (choice.toLowerCase() === 'on') {
            this.machine.setPower(true);
        } else if (choice.toLowerCase() === 'off') {
            this.machine.setPower(false);
        } else {
            console.log('Invalid choice!');
        }
    }

    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    }

    public async start(): Promise<void> {
        console.log('Welcome to the Coffee Machine CLI!');
        
        while (true) {
            this.showMenu();
            const choice = await this.askQuestion('Select an option: ');
            
            switch (choice) {
                case '1':
                    this.showCoffeeMenu();
                    break;
                case '2':
                    await this.buyCoffee();
                    break;
                case '3':
                    console.log(this.machine.getStatus());
                    break;
                case '4':
                    try {
                        this.machine.refillCoffee();
                    } catch (error) {
                        console.log(`Error: ${error}`);
                    }
                    break;
                case '5':
                    try {
                        this.machine.refillWater();
                    } catch (error) {
                        console.log(`Error: ${error}`);
                    }
                    break;
                case '6':
                    await this.toggleWaterSource();
                    break;
                case '7':
                    await this.togglePower();
                    break;
                case '8':
                    console.log('Goodbye!');
                    this.rl.close();
                    return;
                default:
                    console.log('Invalid option!');
            }
        }
    }
}

const cli = new CoffeeMachineCLI();
cli.start().catch(console.error);