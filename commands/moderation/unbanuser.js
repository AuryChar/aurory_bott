import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import {db} from "../../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName('unbanuser')
        .setDescription('Unbans a user from the server')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The user ID to unban')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply('You don\'t have permission to do that!');
        }

        const userId = interaction.options.getString('userid');

        try {
            await interaction.guild.bans.remove(userId);
            await db.collection("bans").deleteOne({_id: userId});
            return interaction.reply(`User with ID \`${userId}\` has been unbanned!`);
        } catch (error) {
            console.error(error);
            return interaction.reply('Error unbanning user! Make sure the ID is correct and the user is actually banned.');
        }
    }
}
