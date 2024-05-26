// --------------------------
//#region Importing Modules, Libraries, and Variables
// --------------------------
require('dotenv').config();
// The term "guild" is used by the Discord API and in discord.js to refer to a Discord server.
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// Require the necessary discord.js classes
const { CLIENT_ID: clientId, TOKEN: token } = process.env; // we are importing TOKEN as token ; CLIENT_ID as clientId
const fs = require('node:fs'); // provide functions for interacting with the File System (fs), similar to POSIX  functions
const path = require('node:path'); // provide utilities for working with file and directory paths; used for manipulating file paths.
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//#endregion Importing Modules, Libraries, and Variables

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection(); //Recommend attaching a `.commands` property to your client instance so that you can access your commands in other files. The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.


// --------------------------
//#region File parsing for commands
// --------------------------
const foldersPath = path.join(__dirname, 'commands'); //path.join() constructs a path to the commands directory
const commandFolders = fs.readdirSync(foldersPath); // reads the path to the directory and returns an ARRAY of all the folder names it contains. So, ./commands/*

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //rads the path to this directory and returns an array of all the file names containing within the current  'folder' of 'comamndFolders'
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
//#end_region File parsing for commands


// --------------------------
//#region Slash Commands Automatic Guild Registration
// --------------------------

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

//#end_region Slash Commands Automatic Guild Registration



// Log in to Discord with your client's token
client.login(token);


// --------------------------
//#region Client Interaction Handling
// --------------------------
client.on(Events.InteractionCreate, async interaction => {
	// console.log(Events)
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
//#end_region Client Interaction Handling
