import {SlashCommandBuilder, PermissionsBitField} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unmuteuser")
        .setDescription("Unmute a user")
        .addUserOption(option => option.setName("user").setDescription("The user to unmute").setRequired(true)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser("user");
        const targetMember = interaction.guild.members.cache.get(targetUser.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply("You don't have permission to do that!");
        }

        if (!targetMember) {
            return interaction.reply("That user doesn't exist!");
        }

        try {
            await targetMember.timeout(null);
            return interaction.reply("User unmuted!");
        } catch (error) {
            return interaction.reply("Error unmuting user!");
        }
    }
}