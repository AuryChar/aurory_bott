import { SlashCommandBuilder, PermissionsBitField, GatewayIntentBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("banuser")
    .setDescription("Bans a user from the server")
      .addUserOption(option => option.setName("user").setDescription("The user to ban").setRequired(true)),

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
              await targetMember.ban();
              return interaction.reply("User banned!");
          } catch (error) {
              return interaction.reply("Error banning user!");
          }
  }
};