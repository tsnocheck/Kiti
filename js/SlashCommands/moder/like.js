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
   name: "like",
   description: "узнать кому ты понравился",
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
      async function showLikedProfiles(interaction) {
         await interaction.deferReply({ ephemeral: true });
         const userID = interaction.user.id;
         const user = await User.findOne({ userID });
         if (!user) {
           console.error(`User ${userID} not found in database`);
           return;
         }
         const likedProfiles = await User.find({ _id: { $in: user.likes } });
         if (likedProfiles.length === 0) {
           // Если никто не лайкнул пользователя, выводим сообщение об этом
           await interaction.editReply({
             content: 'Никто еще не лайкнул вас :(',
             ephemeral: true,
           });
           return;
         }
       
         let currentProfileIndex = 0;
       
         const likeButton = new MessageButton()
           .setCustomId('like')
           .setLabel('💖 Лайк')
           .setStyle('SUCCESS');
       
         const dislikeButton = new MessageButton()
           .setCustomId('dislike')
           .setLabel('❌ Отклонить')
           .setStyle('DANGER');
       
         const buttonsRow = new MessageActionRow().addComponents(
           likeButton,
           dislikeButton
         );
       
         const updateProfile = async () => {
           const profile = likedProfiles[currentProfileIndex];
       
           const profileEmbed = new MessageEmbed()
             .setTitle('Анкета')
             .setDescription(`
               **${profile.names}, ${profile.age}
               ${profile.status}**
             `)
             .setImage(profile.photo)
             .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
             .setTimestamp();
       
           await interaction.editReply({
             embeds: [profileEmbed],
             components: [buttonsRow],
             ephemeral: true,
           });
         };

         const profileLike = async () => {
            const profile = likedProfiles[currentProfileIndex];
        
            const profileEmbed = new MessageEmbed()
              .setTitle('Анкета')
              .setDescription(`
              **Надеюсь хорошо проведете время ;) Начинай общаться 👉 <@${profile.userID}>

              ${profile.names}, ${profile.age}
              ${profile.status}**
              `)
              .setImage(user.photo)
              .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
              .setTimestamp();
              const buttonsRow = new MessageActionRow().addComponents(
               new MessageButton()
               .setURL(`https://discord.com/users/${profile.userID}/`)
               .setLabel('Связаться')
               .setStyle('LINK')
             );
             await interaction.followUp({
               embeds: [profileEmbed],
               components: [buttonsRow],
               ephemeral: true,
             });
          };

         const sendM = async () => {
            const profile = likedProfiles[currentProfileIndex];
        
            const profileEmbed = new MessageEmbed()
              .setTitle('Анкета')
              .setDescription(`
              **У вас взаимная симпатия! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <@${user.userID}>

              ${user.names}, ${user.age}
              ${user.status}**
              `)
              .setImage(user.photo)
              .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
              .setTimestamp();
              const buttonsRow = new MessageActionRow().addComponents(
               new MessageButton()
               .setURL(`https://discord.com/users/${user.userID}/`)
               .setLabel('Связаться')
               .setStyle('LINK')
             );
            let members = interaction.guild.members.cache.get(profile.userID);
            members.send({embeds:[profileEmbed], components:[buttonsRow]})
          };
       
         const handleInteraction = async (i) => {
           if (i.user.id !== interaction.user.id) {
             await i.reply({
               content: 'Это не ваш профиль',
               ephemeral: true,
             });
             return;
           }
       
           switch (i.customId) {
            case 'like':
               user.likes = user.likes.filter((id) => id.toString() !== likedProfiles[currentProfileIndex]._id.toString());
               await user.save();
               await sendM()
               await profileLike()
               currentProfileIndex++;
               if (currentProfileIndex >= likedProfiles.length) {
                   const profileEmbed = new MessageEmbed()
                   .setTitle('Анкета')
                   .setDescription(`**Вы просмотрели всех лайкнувших вас пользователей**`)
                   .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                   .setTimestamp();
                   await interaction.editReply({
                       embeds:[profileEmbed],
                       components: [],
                       ephemeral: true,
                   });
               } else {
                   await i.reply({content:'Вы лайкнули этого пользователя', ephemeral:true})
                   await updateProfile();
               }
               break;
       
             case 'dislike':
               user.likes = user.likes.filter((id) => id.toString() !== likedProfiles[currentProfileIndex]._id.toString());
               await user.save();
               currentProfileIndex++;
               if (currentProfileIndex >= likedProfiles.length) {
                  const profileEmbed = new MessageEmbed()
                  .setTitle('Анкета')
                  .setDescription(`**Вы просмотрели всех лайкнувших вас пользователей**`)
                  .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                  .setTimestamp();
                 await interaction.editReply({
                  embeds:[profileEmbed],
                   components: [],
                   ephemeral: true,
                 });
                 i.reply({content:'Вы отклонили этого пользователя', ephemeral:true})
                 return;
               }
       
               await updateProfile();
               break;
       
             default:
               break;
           }
         };
       
         await updateProfile();
       
         const collector = interaction.channel.createMessageComponentCollector({
           filter: (i) => i.user.id === interaction.user.id && (i.customId === 'like' || i.customId === 'dislike'),
           time: 60000,
         });
       
         collector.on('collect', handleInteraction);
         collector.on('end', async () => {
           await interaction.editReply({
             components: [],
           });
         });
       }
       showLikedProfiles(interaction)
         }
   }
}