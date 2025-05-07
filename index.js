import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join('./events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = (await import(`./events/${file}`)).default;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

try {
    client.login(process.env.TOKEN);
    console.log("Server is on")
} catch (error) {
    console.error(error);
}
