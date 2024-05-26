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
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers) //Checks if user can ban members
		// In Discord, each user and role has a set of permissions that determine what actions they can perform within a server or channel.These permissions are represented as bits in a bitfield, which is a compact way of storing a collection of true/false values.
		// For example, the PermissionFlagsBits object in Discord.js provides a set of constants that represent different permissions, such as BanMembers, KickMembers, ManageMessages, and so on.Each of these constants is a number that corresponds to a specific bit position in the bitfield.
		// The statement PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers uses the bitwise OR operator(|) to combine the bit representations of the BanMembers and KickMembers permissions.When you combine permissions using the bitwise OR operator, you're effectively creating a new bitfield that represents the union of those permissions.
		//
		// In other words, if you require a user or role to have the combined permissions PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers, it means the user or role must have both the BanMembers and KickMembers permissions set in their bitfield.
		//
		// The key point made in the provided statement is that you cannot require any of multiple permissions using the bitwise OR operator.The Discord API evaluates permissions against the combined bitfield, not individual permissions.
		// For example, let's say you have a command that requires either the BanMembers or KickMembers permission. You cannot achieve this by combining the permissions with the bitwise OR operator because the resulting bitfield would require both permissions to be present.
		// To summarize:
		//
		// 		Permissions in Discord are represented as bits in a bitfield.
		// The bitwise OR operator(|) is used to combine permissions, creating a new bitfield that represents the union of those permissions.
		// When checking permissions, Discord evaluates against the combined bitfield, not individual permissions.
		// If you combine multiple permissions using the bitwise OR operator, it requires all of those permissions to be present in the bitfield, not any of them.

		// This concept of bitwise operations and bitfields is common in low- level programming and is often used to efficiently store and manipulate flags or collections of boolean values.
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
