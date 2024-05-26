const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
	cooldown: 1,
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input, at the desired channel.')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input that echo will repeat.')
				.setMaxLength(2000) // Ensure the text will fit in embed description
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('Whether or not the echo should be ephemeral, or only seen to you.'))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel the echo will be posted into.')
				.addChannelTypes(ChannelType.GuildText)),
	async execute(interaction) {
		const messageToEcho = interaction.options.getString('input');
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
		const targetChannel = interaction.options.getChannel('channel') ?? interaction.channel;

		try {
			await targetChannel.send({ content: messageToEcho });
			await interaction.reply({ content: 'Message sent successfully!', ephemeral: ephemeral });
		} catch (error) {
			console.error('Error sending message:', error);
			await interaction.reply({ content: 'Failed to send the message. Please check if I have the necessary permissions.', ephemeral: true });
		}
	}
};
