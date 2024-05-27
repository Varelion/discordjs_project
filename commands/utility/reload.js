const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}
		console.log(command.category, command.data.name)
		delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];

		try {
			console.log("BEFORE", interaction.client.commands)
			interaction.client.commands.delete(command.data.name);
			console.log("DURING", interaction.client.commands)

			const newCommand = require(`../${command.category}/${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			console.log("after", interaction.client.commands)
			await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
};
