//  creating a ping.js file in the commands/utility folder for your first command. Inside this file, you're going to define and export two items.

// The data property, which will provide the command definition shown above for registering to Discord.
// The execute method, which will contain the functionality to run from our event handler when the command is used.
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5, // cooldown of five seconds
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

// https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files
