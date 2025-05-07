import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const commands = [];
const foldersPath = path.join('./commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(foldersPath, folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = (await import(`./commands/${folder}/${file}`)).default;
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🌀 refreshing commands...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ commands registered successfully!');
    } catch (error) {
        console.error(error);
    }
})();
