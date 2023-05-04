const { Client } = require("discord.js");
const Discord = require("discord.js");
const ms = require('ms');
const moment = require("moment");
const User = require("../../user");
const { MessageEmbed, Message, MessageAttachment} = require('discord.js');
const { MessageButton, MessageSelectMenu, WebhookClient,} = require('discord.js');
const { MessageActionRow, Modal, TextInputComponent, CommandInteraction } = require('discord.js');
messagefind = new Map()

module.exports = {
   name: "profile",
   description: "ваша анкета",
   type: "CHAT_INPUT",

run: async (client, interaction, args, message) => {
   let member = interaction.guild.members.cache.get(interaction.user.id);
   let user = await User.findOne({userID:interaction.user.id})
   if(!user){
      const regestration = new MessageEmbed()
      .setTitle('Анкета')
      .setDescription('**У вас еще нет анкеты в нашем боте, хотите ее создать?**')
      .setThumbnail(member.displayAvatarURL({dynamic:true}))
      .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
      .setTimestamp();

      const but = new MessageActionRow()
      .addComponents(
         new MessageButton()
         .setCustomId('create')
         .setLabel(`Создать`)
         .setStyle(`SUCCESS`)
      )
      let msg = await interaction.reply({embeds:[regestration], components:[but], fetchReply:true})
      const collector = await msg.createMessageComponentCollector()
      messagefind.set(interaction.user.id, msg);
      collector.on('collect', async i => {
         if(i.customId == 'create'){
         if(i.user.id != interaction.user.id) return i.reply({content:'Это не ваше сообщение, вы не имеете доступ к этой кнопке', ephemeral:true})
         const modal = new Modal()
            .setCustomId('anketa')
            .setTitle('Заполните анкету');
         const name = new TextInputComponent()
            .setCustomId('name')
            .setLabel("Ваше имя")
            .setStyle('SHORT')
            .setRequired(true)
         const age = new TextInputComponent()
            .setCustomId('age')
            .setLabel("Ваш возраст")
            .setStyle('SHORT')
            .setRequired(true)
         const sex = new TextInputComponent()
            .setCustomId('sex')
            .setLabel("Ваш пол (М или Ж)")
            .setStyle('SHORT')
            .setRequired(true)
         const status = new TextInputComponent()
            .setCustomId('status')
            .setLabel("Ваш статус")
            .setStyle('PARAGRAPH')
            .setRequired(true)
         const photo = new TextInputComponent()
            .setCustomId('photo')
            .setLabel("Ссылка на ваше фото")
            .setStyle('SHORT')
            .setRequired(true)
        const q = new MessageActionRow().addComponents(name);
        const w = new MessageActionRow().addComponents(age);
        const e = new MessageActionRow().addComponents(status);
        const t = new MessageActionRow().addComponents(photo);
        const r = new MessageActionRow().addComponents(sex);
        modal.addComponents(q,w,r,e,t);
        await i.showModal(modal);
         }
      })
   }else{
      const but = new MessageActionRow()
      .addComponents(
         new MessageButton()
         .setCustomId('redact')
         .setLabel(`Заполнить заново`)
         .setStyle('SECONDARY')
      )
      const profile = new MessageEmbed()
      .setTitle(`Ваша анкета`)
      .setDescription(`
      **${user.names}, ${user.age}
      ${user.status}**
      `)
      .setImage(user.photo)
      .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
      .setTimestamp();

      let msg = await interaction.reply({embeds:[profile], components:[but], fetchReply:true})
      const collector = await msg.createMessageComponentCollector()
      messagefind.set(interaction.user.id, msg);
      collector.on('collect', async i => {
         if(i.customId == 'redact'){
            if(i.user.id != interaction.user.id) return i.reply({content:'Это не ваше сообщение, вы не имеете доступ к этой кнопке', ephemeral:true})
            const modal = new Modal()
               .setCustomId('reanketa')
               .setTitle('Заполните анкету');
            const name = new TextInputComponent()
               .setCustomId('name')
               .setLabel("Ваше имя")
               .setStyle('SHORT')
               .setRequired(true)
            const age = new TextInputComponent()
               .setCustomId('age')
               .setLabel("Ваш возраст")
               .setStyle('SHORT')
               .setRequired(true)
            const sex = new TextInputComponent()
               .setCustomId('sex')
               .setLabel("Ваш пол (М или Ж)")
               .setStyle('SHORT')
               .setRequired(true)
            const status = new TextInputComponent()
               .setCustomId('status')
               .setLabel("Ваш статус")
               .setStyle('PARAGRAPH')
               .setRequired(true)
            const photo = new TextInputComponent()
               .setCustomId('photo')
               .setLabel("Ссылка на ваше фото")
               .setStyle('SHORT')
               .setRequired(true)
           const q = new MessageActionRow().addComponents(name);
           const w = new MessageActionRow().addComponents(age);
           const e = new MessageActionRow().addComponents(status);
           const t = new MessageActionRow().addComponents(photo);
           const r = new MessageActionRow().addComponents(sex);
           modal.addComponents(q,w,r,e,t);
           await i.showModal(modal);
         }
      })
   }

}}