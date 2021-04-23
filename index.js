const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true
    }),
    config = require('./config.json'),
    fs = require('fs')
 
client.login(process.env.TOKEN);
client.commands = new Discord.Collection()
 
fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})
 
client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
 
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(message, args, client)
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`━────── •●• ──────━
    **${member} Vient de nous rejoindre !
    Accueillons-le/la comme il se doit !**
    Nous sommes maintenant **${member.guild.memberCount}** grâce à lui !
    ━────── •●• ──────━`)
   
})

client.on('ready', () => {
    const statuses = [
        () => `'🔐༄dsc.gg/7sbVCXeR4H'`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} membres`,
        () => `'🐟・CANDIDATURE ON`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'PLAYING'})
        i = ++i % statuses.length
    }, 1e4)
})