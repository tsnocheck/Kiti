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
   name: "find",
   description: "поиск анкет",
   type: "CHAT_INPUT",

run: async (client, interaction, args, message) => {
   let member = interaction.guild.members.cache.get(interaction.user.id);
   let user = await User.findOne({userID:interaction.user.id, guild:interaction.guild.id})
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
      async function getAndSendRandomProfile(interaction) {
         const user = await User.findOne({ userID: interaction.user.id });
         if (!user) {
           // Если пользователь не найден, то выводим сообщение об ошибке
           console.error(`User ${interaction.user.id} not found in database`);
           return;
         }
       
         const unviewedProfiles = await User.find({ _id: { $nin: user.vising }, userID: { $ne: interaction.user.id } });
         if (unviewedProfiles.length === 0) {
           // Если все анкеты были просмотрены, выводим сообщение об этом
           const noMoreProfilesEmbed = new MessageEmbed()
               const no = new MessageEmbed()
               .setTitle(`Анкеты`)
               .setDescription(`
               **Анкеты для просмотра кончились, попробуйте использовать команду чуть позже**
               `)
               .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
               .setTimestamp();
       
           await interaction.reply({ embeds: [no]});
           return;
         }
       
         // Выбираем случайную непросмотренную анкету
         const randomProfile = unviewedProfiles[Math.floor(Math.random() * unviewedProfiles.length)];
       
         // Добавляем анкету в массив просмотренных анкет
         user.vising.push(randomProfile._id);
         await user.save();

         const but = new MessageActionRow()
         .addComponents(
            new MessageButton()
            .setCustomId('find')
            .setEmoji('➡')
            .setStyle(`SUCCESS`),
            new MessageButton()
            .setCustomId('like')
            .setEmoji('💖')
            .setStyle(`SUCCESS`),
            new MessageButton()
            .setCustomId('message')
            .setEmoji('💌')
            .setStyle(`SUCCESS`),
            new MessageButton()
            .setCustomId('report')
            .setEmoji('📃')
            .setStyle(`DANGER`),
         )
         // Отображаем анкету
         const profileEmbed = new MessageEmbed()
           .setTitle('Анкета')
           .setDescription(`
             **${randomProfile.names}, ${randomProfile.age}
             ${randomProfile.status}**
           `)
           .setImage(randomProfile.photo)
           .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
           .setTimestamp();
       
         let msg = await interaction.reply({ embeds: [profileEmbed], components:[but], fetchReply:true });
         const collector = await msg.createMessageComponentCollector()
         collector.on('collect', async i => {
            if(i.user.id != interaction.user.id) return i.reply({content:'Это не ваш поиск. Для поиска введите команду /find', ephemeral:true})
            if(i.customId == 'find'){
               const user = await User.findOne({ userID: interaction.user.id });
               if (!user) {
                 // Если пользователь не найден, то выводим сообщение об ошибке
                 console.error(`User ${i.user.id} not found in database`);
                 return;
               }
             
               const unviewedProfiles = await User.find({ _id: { $nin: user.vising }, userID: { $ne: interaction.user.id } });
               if (unviewedProfiles.length === 0) {
                 // Если все анкеты были просмотрены, выводим сообщение об этом
                 const noMoreProfilesEmbed = new MessageEmbed()
                     const no = new MessageEmbed()
                     .setTitle(`Анкеты`)
                     .setDescription(`
                     **Анкеты для просмотра кончились, попробуйте использовать команду чуть позже**
                     `)
                     .setFooter({ text: `Выполнил: ${i.user.tag}` })
                     .setTimestamp();
             
                 await msg.edit({ embeds: [no], components:[]});
                 return;
               }
             
               // Выбираем случайную непросмотренную анкету
               const randomProfile = unviewedProfiles[Math.floor(Math.random() * unviewedProfiles.length)];
             
               // Добавляем анкету в массив просмотренных анкет
               user.vising.push(randomProfile._id);
               await user.save();
      
               const but = new MessageActionRow()
               .addComponents(
                  new MessageButton()
                  .setCustomId('find')
                  .setEmoji('➡')
                  .setStyle(`SUCCESS`),
                  new MessageButton()
                  .setCustomId('like')
                  .setEmoji('💖')
                  .setStyle(`SUCCESS`),
                  new MessageButton()
                  .setCustomId('message')
                  .setEmoji('💌')
                  .setStyle(`SUCCESS`),
                  new MessageButton()
                  .setCustomId('report')
                  .setEmoji('📃')
                  .setStyle(`DANGER`),
               )
               // Отображаем анкету
               const profileEmbed = new MessageEmbed()
                 .setTitle('Анкета')
                 .setDescription(`
                   **${randomProfile.names}, ${randomProfile.age}
                   ${randomProfile.status}**
                 `)
                 .setImage(randomProfile.photo)
                 .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                 .setTimestamp();
                 messagefind.set(interaction.user.id, randomProfile._id)
                 await i.update({embeds:[profileEmbed], components:[but]})
            }
            if(i.customId == 'like'){
                  const userID = i.user.id;
                  const profileID = messagefind.get(userID);
                  const user = await User.findOne({ userID });
                  if (!user) {
                    console.error(`User ${userID} not found in database`);
                    return;
                  }
                  // Находим пользователя, которого мы лайкнули
                  const likedUser = await User.findOne({ _id: profileID });
                  let member = interaction.guild.members.cache.get(likedUser.userID);
                  if (!likedUser) {
                    console.error(`Profile ${profileID} not found in database`);
                    return;
                  }
                  const dmlike = new MessageEmbed()
                  .setTitle('Анкеты')
                  .setDescription(`
                  **Ты понравился 1 человеку. Хочешь посмотреть кому ты понравился? Используй серверную команду \`/like\`**
                  `)
                  .setTimestamp();
                  likedUser.likes.push(user._id); // Добавляем наш ID в список его лайков
                  await likedUser.save(); // Сохраняем изменения в базе данных
                  await user.save();
                  member.send({embeds:[dmlike]})
             }
         })
       }
       getAndSendRandomProfile(interaction)
         }
   }
}