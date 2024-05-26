//  creating a ping.js file in the commands/utility folder for your first command. Inside this file, you're going to define and export two items.
const wait = require('node:timers/promises').setTimeout;
// The data property, which will provide the command definition shown above for registering to Discord.
// The execute method, which will contain the functionality to run from our event handler when the command is used.
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5, // cooldown of five
	category: 'utility', // can be used to place in different directories, for reload.js,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!'); // You have three seconds to establish the first reply
		const botLatency = Date.now() - interaction.createdTimestamp;
		await interaction.editReply(`Pong again!!!!\nBot latency: ${botLatency}ms`);
	},
};

// https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files
