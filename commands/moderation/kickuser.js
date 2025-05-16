import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kickuser")
        .setDescription("Kick a user")
        .addUserOption(option => option.setName("user").setDescription("The user to kick").setRequired(true)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser("user");
        const targetMember = interaction.guild.members.cache.get(targetUser.id);

        // Check if the bot has permission to kick
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply("I don't have permission to kick users!");
        }

        // Check if the user has permission to execute the command
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply("You don't have permission to do that!");
        }

        // Check if the user exists in the guild
        if (!targetMember) {
            return interaction.reply("That user doesn't exist in the server!");
        }

        try {
            await targetMember.kick();
            return interaction.reply("User kicked!");
        } catch (error) {
            console.error("Error:", error);
            return interaction.reply("Error kicking user! Please check permissions.");
        }
    }
}
