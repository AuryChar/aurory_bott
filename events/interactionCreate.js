import { Events } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const commandFolders = fs.readdirSync('./commands');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = (await import(`../commands/${folder}/${file}`)).default;
                if (interaction.commandName === command.data.name) {
                    try {
                        await command.execute(interaction);
                    } catch (error) {
                        console.error(error);
                        await interaction.reply({ content: 'Error executing command.', ephemeral: true });
                    }
                    return;
                }
            }
        }
    }
}
