import { SlashCommandBuilder } from 'discord.js';
import {db} from "../../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Return pong'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    }
}
