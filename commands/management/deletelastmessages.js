import { SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { db } from "../../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("deletemessages")
        .setDescription("Delete the last values messages in the channel")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("The amount of messages to delete")
                .setMinValue(1)
                .setRequired(false)
        ),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const channel = interaction.channel;

        if (!channel.isTextBased()) {
            return interaction.reply("This command can only be used in text channels!");
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply("You don't have permission to delete messages!");
        }

        const configDoc = await db.collection("bot_configs").findOne({ serverId: guildId });
        const currentDeleteLimit = configDoc?.config?.deleteLimit ?? 100;

        const requestedAmount = interaction.options.getInteger("amount") ?? currentDeleteLimit;

        const effectiveAmount = Math.min(requestedAmount, 100);

        if (interaction.options.getInteger("amount") !== null) {
            await db.collection("bot_configs").updateOne(
                { serverId: guildId },
                {
                    $set: {
                        "config.deleteLimit": effectiveAmount,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
        }

        await interaction.deferReply();

        try {
            const messages = await channel.messages.fetch({ limit: effectiveAmount });
            await Promise.all(messages.map(message => message.delete() + 1));
        } catch (error) {
            console.error("Error deleting messages:", error);
            return interaction.editReply("An error occurred while trying to delete the messages.");
        }
    }
};