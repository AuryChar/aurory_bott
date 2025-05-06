import {
    Client,
    Events,
    GatewayIntentBits,
    REST,
    Routes,
    ChannelType,
    SlashCommandBuilder,
    PermissionsBitField
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Return pong'),

    new SlashCommandBuilder()
        .setName('createchannel')
        .setDescription('Create a channel')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the channel')
                .setRequired(true)
        )
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function main() {
    try {
        console.log("Started refreshing application (/ or !) commands.");
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log("Successfully reloaded application (/ or !) commands.");
    } catch (error) {
        console.error(error);
    }
}
main();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on(Events.InteractionCreate, async interaction => {
    const botAdmin = interaction.guild.members.me;
    if (botAdmin.permissions.has(PermissionsBitField.Flags.Administrator)) {

        if (interaction.commandName === "ping") {
            await interaction.reply("Pong!");
        }

        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            if (interaction.commandName === "createchannel") {
                await interaction.reply("Creating channel...");

                await interaction.guild.channels.create({
                    name: `${interaction.options.getString("name")}`,
                    type: ChannelType.GuildText,
                    reason: `Criado por ${interaction.user.tag} via comando!`
                });

                await interaction.editReply("Channel created!");
            }
        } else {
            await interaction.reply("You don't have permission to use this command!");
        }
    } else {
        await interaction.reply("I don't have permission to use this command!");
    }
});

client.login(process.env.TOKEN);
