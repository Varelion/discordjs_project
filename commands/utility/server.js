const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		// interaction.guild is the object representing the guild in which the command was run
		await IntegrationApplication.reply(`This server is ${interaction.guild.name} and has ${interaciton.guild.memberCount} members.`)
	},
};

