import { SlashCommandBuilder, PermissionsBitField, GatewayIntentBits } from "discord.js";
import {db} from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("banuser")
    .setDescription("Bans a user from the server")
      .addUserOption(option => option.setName("user").setDescription("The user to ban").setRequired(true))
      .addStringOption(option => option.setName("reason").setDescription("The reason for the ban").setRequired(false)),

  async execute(interaction) {
          const targetUser = interaction.options.getUser("user");
          const targetMember = interaction.guild.members.cache.get(targetUser.id);
          const reason = interaction.options.getString("reason") || 'No reason provided';

          if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
              return interaction.reply("You don't have permission to do that!");
          }

          if (!targetMember) {
              return interaction.reply("That user doesn't exist!");
          }

          try {
              await targetMember.ban();
              await db.collection("bans").updateOne({_id: targetMember.id}, {
                  $set: {
                      username: targetUser.username,
                      guildname: interaction.guild.name,
                  }
              }, {upsert: true});
              return interaction.reply(`User banned! Reason: ${reason}`);
          } catch (error) {
              return interaction.reply("Error banning user!");
          }
  }
};