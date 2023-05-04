const client = require("../index");
const { MessageEmbed, Message } = require('discord.js');
const { MessageButton, MessageSelectMenu, WebhookClient,} = require('discord.js');
const { MessageActionRow, Modal, TextInputComponent, CommandInteraction } = require('discord.js');
const { Collection } = require('discord.js');
const { text } = require("stream/consumers");
const moment = require("moment");
const User = require("../user");
const generate = require('../SlashCommands/moder/find');
client.on("interactionCreate", async (interaction) => {
   const member = interaction.member

   // ———————————————[Slash Commands]———————————————
   if (interaction.isCommand()) {

      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd)
         return interaction.reply({ content: "An error has occured " });

      const args = [];

      for (let option of interaction.options.data) {
         if (option.type === "SUB_COMMAND") {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
               if (x.value) args.push(x.value);
            });
         } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(
         interaction.user.id
      );

      cmd.run(client, interaction, args);
   }
   // ———————————————[Buttons]———————————————
   if (interaction.isButton()) {
   } 
   // ———————————————[Select Menu]———————————————
  //  if(interaction.isSelectMenu()){
  //   const profileID = reportanketa.get(interaction.user.id);
  //   // const interactions = interactions.get(interaction.user.id);
  //   if(interaction.customId == 'setting'){
  //     if(interaction.values[0] == '18+'){
  //     }
  //   }
  //  }
   if(interaction.isModalSubmit()){
        if(interaction.customId == 'anketa'){
            const name = interaction.fields.getTextInputValue('name');
            const age = interaction.fields.getTextInputValue('age');
            const status = interaction.fields.getTextInputValue('status');
            const photo = interaction.fields.getTextInputValue('photo');
            const sex = interaction.fields.getTextInputValue('sex');

            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

            function isImage(url) {
            const extension = url.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension);
            }

            function isNumber(text) {
                return !isNaN(parseFloat(text)) && isFinite(text);
              }

            function compareStrings(string1, string2) {
                return string1 === string2;
              }


              if(isNumber(age)){
                if (sex === "м" || sex === "ж"|| sex === "М" || sex === "Ж") {
                    if (urlRegex.test(photo) && isImage(photo)) {
                        const user = new User({userID:interaction.user.id, guild:interaction.guild.id, sex:sex, age:age, status:status, photo:photo, names:name})
                        await user.save()
                        const msg = messagefind.get(interaction.user.id)
            
                        const profile = new MessageEmbed()
                        .setTitle(`Ваша анкета`)
                        .setDescription(`
                        **${user.names}, ${user.age}
                        ${user.status}**
                        `)
                        .setImage(user.photo)
                        .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                        .setTimestamp();
                        
                        msg.edit({embeds:[profile], components:[], fetchReply:true})
                        interaction.reply({content:'Вы успешно создали анкету', ephemeral:true})
                    } else {
                        interaction.reply({content:'Введите корректную ссылку на изображение', ephemeral:true})
                    }
                }else{
                    interaction.reply({content:'Введите в графе пол м или ж', ephemeral:true})
                }
              }else{
                interaction.reply({content:'Введите корректную информацию о возрасте', ephemeral:true})
              }
        }
        if(interaction.customId == 'reanketa'){
            const name = interaction.fields.getTextInputValue('name');
            const age = interaction.fields.getTextInputValue('age');
            const status = interaction.fields.getTextInputValue('status');
            const photo = interaction.fields.getTextInputValue('photo');
            const sex = interaction.fields.getTextInputValue('sex');

            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

            function isImage(url) {
            const extension = url.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension);
            }

            function isNumber(text) {
                return !isNaN(parseFloat(text)) && isFinite(text);
              }

            function compareStrings(string1, string2) {
                return string1 === string2;
              }


              if(isNumber(age)){
                if(age < 13) interaction.reply({content:'Простите, но вы не можете пользоваться данным ботом так как вам меньше 13 лет', ephemeral:true})
                if (sex === "м" || sex === "ж"|| sex === "М" || sex === "Ж") {
                    if (urlRegex.test(photo) && isImage(photo)) {
                        let user = await User.findOne({userID:interaction.user.id})
                        let dura = age
                        if(dura < 18) dura = 'Меньше 18'

                        user.sex = sex
                        user.age = dura
                        user.status = status
                        user.photo = photo
                        user.names = name
                        await user.save()
                        const msg = messagefind.get(interaction.user.id)
            
                        const profile = new MessageEmbed()
                        .setTitle(`Ваша анкета`)
                        .setDescription(`
                        **${user.names}, ${user.age}
                        ${user.status}**
                        `)
                        .setImage(user.photo)
                        .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                        .setTimestamp();
                        
                        msg.edit({embeds:[profile], components:[], fetchReply:true})
                        interaction.reply({content:'Вы успешно создали анкету', ephemeral:true})
                    } else {
                        interaction.reply({content:'Введите корректную ссылку на изображение', ephemeral:true})
                    }
                }else{
                    interaction.reply({content:'Введите в графе пол м или ж', ephemeral:true})
                }
              }else{
                interaction.reply({content:'Введите корректную информацию о возрасте', ephemeral:true})
              }
        }
   }
   // ———————————————[Context Menu]———————————————
   if (interaction.isContextMenu()) {
      await interaction.deferReply({ ephemeral: false });
      const command = client.slashCommands.get(interaction.commandName);
      if (command) command.run(client, interaction);
   }
});
