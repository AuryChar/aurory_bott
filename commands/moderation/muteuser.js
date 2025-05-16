import {SlashCommandBuilder, PermissionsBitField} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('muteuser')
        .setDescription('Mutes a user')
        .addUserOption(option => option.setName('user').setDescription('The user to mute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the mute').setRequired(false))
        .addIntegerOption(option => option.setName('time').setDescription('The time to mute the user for(default is 10 min)').setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const targetMember = interaction.guild.members.cache.get(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const timeout = interaction.options.getInteger('time') || 10;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply('You don\'t have permission to do that!');
        }

        if (!targetMember) {
            return interaction.reply('That user doesn\'t exist!');
        }

        try {
            await targetMember.timeout(timeout * 60 * 1000);
            return interaction.reply(`User muted for ${timeout} minutes! Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Error muting user!', ephemeral: true});
        }
    }
}