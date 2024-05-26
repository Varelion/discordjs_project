const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to ban')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for banning'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
	async execute(interaction) {
		// Retrieve options from the interaction
		const targetOption = interaction.options.get('target');
		const reasonOption = interaction.options.get('reason');

		// Destructure and rename the value properties to get the Snowflakes
		const { value: targetId } = targetOption;
		const reason = reasonOption ? reasonOption.value : 'No reason provided';

		// Get the user object from the guild members cache
		const targetUser = await interaction.guild.members.fetch(targetId);

		// Reply to acknowledge the command
		await interaction.reply(`Banning ${targetUser.user.username} (${targetId}) for reason: ${reason}`);

		// Try to ban the target user
		try {
			await interaction.guild.members.ban(targetId, { reason });
			// Confirm the ban to the user
			await interaction.followUp(`${targetUser.user.username} (${targetId}) has been banned for: ${reason}`);
		} catch (error) {
			// Handle errors (e.g., missing permissions, hierarchy issues)
			console.error(`Failed to ban ${targetUser.user.username} (${targetId}):`, error);
			await interaction.followUp(`Failed to ban ${targetUser.user.username} (${targetId}). Please check the bot's permissions and role hierarchy.`);
		}
	},
};
