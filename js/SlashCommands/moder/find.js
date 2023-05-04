const { Client } = require("discord.js");
const Discord = require("discord.js");
const ms = require('ms');
const moment = require("moment");
const User = require("../../user");
const { MessageEmbed, Message, MessageAttachment} = require('discord.js');
const { MessageButton, MessageSelectMenu, WebhookClient,} = require('discord.js');
const { MessageActionRow, Modal, TextInputComponent, CommandInteraction } = require('discord.js');
messagefind = new Map()
reportanketa = new Map()
module.exports = {
   name: "find",
   description: "поиск анкет",
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
      async function getAndSendRandomProfile(interaction) {
        const eo = new MessageEmbed()
        .setTitle(`Анкеты`)
        .setDescription(`
          **Генерация анкеты...**
        `)
        .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
        .setTimestamp();
         await interaction.reply({embeds:[eo], fetchReply:true});
         const generate = async (i) => {
           const user = await User.findOne({ userID: interaction.user.id });
           if (!user) {
             console.error(`User ${interaction.user.id} not found in database`);
             return;
           }
       
           const unviewedProfiles = await User.find({ _id: { $nin: user.vising }, userID: { $ne: interaction.user.id } });
           if (unviewedProfiles.length === 0) {
             const no = new MessageEmbed()
               .setTitle(`Анкеты`)
               .setDescription(`
                 **Анкеты для просмотра кончились, попробуйте использовать команду чуть позже**
               `)
               .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
               .setTimestamp();
       
             await interaction.editReply({embeds: [no], components:[] });
             return;
           }
       
           const randomProfile = unviewedProfiles[Math.floor(Math.random() * unviewedProfiles.length)];
       
           user.vising.push(randomProfile._id);
           await user.save();
       
           const but = new MessageActionRow()
             .addComponents(
               new MessageButton()
                 .setCustomId('find')
                 .setLabel('Далее')
                 .setEmoji('➡')
                 .setStyle(`SUCCESS`),
               new MessageButton()
                 .setCustomId('like')
                 .setLabel('Лайк')
                 .setEmoji('💖')
                 .setStyle(`SUCCESS`),
               new MessageButton()
                 .setCustomId('report')
                 .setLabel('Репорт')
                 .setEmoji('📃')
                 .setStyle(`DANGER`),
                new MessageButton()
                 .setCustomId('delete')
                 .setLabel('Удалить')
                 .setEmoji('❎')
                 .setStyle(`DANGER`),
             )
       
           const profileEmbed = new MessageEmbed()
             .setTitle('Анкета')
             .setDescription(`
               **${randomProfile.names}, ${randomProfile.age}
               ${randomProfile.status}**
             `)
             .setImage(randomProfile.photo)
             .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
             .setTimestamp();
             messagefind.set(interaction.user.id, randomProfile)
           await interaction.editReply({embeds: [profileEmbed], components: [but], fetchReply: true });
         }
       
         const collector = await interaction.channel.createMessageComponentCollector()
         collector.on('collect', async i => {
           if (i.user.id != interaction.user.id) return i.reply({ content: 'Это не ваш поиск. Для поиска введите команду /find', ephemeral: true })
           switch (i.customId) {
            case 'find':
              await i.deferUpdate();
              await generate();
            break;
            case 'like':
              const userID = i.user.id;
              const profileID = messagefind.get(userID);
              const user = await User.findOne({ userID });
              if (!user) {
                console.error(`User ${userID} not found in database`);
                return;
              }
              // Находим пользователя, которого мы лайкнули
              const likedUser = await User.findOne({ _id: profileID._id });
              let member = interaction.guild.members.cache.get(likedUser.userID);
              if (!likedUser) {
                console.error(`Profile ${profileID._id} not found in database`);
                return;
              }
              const dmlike = new MessageEmbed()
              .setTitle('Анкеты')
              .setDescription(`
              **Ты понравился 1 человеку. Хочешь посмотреть кому ты понравился? Используй команду \`/like\` на сервере где есть бот.**
              `)
              .setTimestamp();
              likedUser.likes.push(user._id); // Добавляем наш ID в список его лайков
              await likedUser.save(); // Сохраняем изменения в базе данных
              await user.save();
              member.send({embeds:[dmlike]})
              i.reply({content:'Вы успешно лайкнули пользователя', ephemeral:true})
              await generate();
            break;
            case 'report':
              const userid = i.user.id;
              const profile = messagefind.get(userid);
              reportanketa.set(interaction.user.id, profile)
              const reportemb = new MessageEmbed()
              .setTitle('Анкеты')
              .setDescription(`
              **Выберете причину репорта ниже:**
              `)
              .setTimestamp();

              const select = new MessageActionRow()
              .addComponents(
                  new MessageSelectMenu()
                      .setCustomId('setting')
                      .setPlaceholder('Выберете')
                      .addOptions([
                          {
                              label: 'Материал для взрослых.',
                              emoji:'🔞',
                              value: '18+',
                          },
                          {
                              label: 'Продажа товаров и услуг.',
                              emoji:'💰',
                              value: 'selling',
                          },
                          {
                              label: 'Пропоганда чего-либо',
                              emoji: '📣',
                              value: 'propoganda',
                          },
                          {
                            label: 'Оскорбительная анкета',
                            emoji: '📄',
                            value: 'oskprofile',
                        },
                        {
                          label: 'Другое',
                          emoji: '📜',
                          value: 'drugoe',
                      },
                      ]),
              );
              let smg = await i.reply({embeds:[reportemb], components:[select], ephemeral:true, fetchReply:true})
              const collector = await smg.createMessageComponentCollector()
              collector.on('collect', async int => {
                if (i.user.id != interaction.user.id) return i.reply({ content: 'Это не ваш поиск. Для поиска введите команду /find', ephemeral: true })
                const profileID = reportanketa.get(interaction.user.id);
                const fd = new MessageEmbed()
                .setTitle('Репорт на анкету')
                .setDescription(`
                **Вы успешно отправили репорт.
                Он будет рассмотрен в ближайшее время**
                `)
                .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                .setTimestamp();
                const guildId = '992428549342498836';
                const guild = client.guilds.cache.get(guildId);
                const ch = guild.channels.cache.find(c => c.id === '1096990234262130789')
                if (int.isSelectMenu()) {
                switch (int.values[0]) {
                  
                  case '18+':
                    const profileEmbed = new MessageEmbed()
                    .setTitle('Репорт на анкету')
                    .setDescription(`
                    **Причина репорта:
                    \`\`\`18+\`\`\`
                    **${profileID.names}, ${profileID.age}
                    ${profileID.status}**
                    `)
                    .setImage(profileID.photo)
                    .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                    .setTimestamp();

                    await ch.send({embeds:[profileEmbed]})
                    await int.update({embeds:[fd],components:[], ephemeral:true})
                    await generate();
                  break

                  case 'selling':
                    const profileEmbesd = new MessageEmbed()
                    .setTitle('Репорт на анкету')
                    .setDescription(`
                    **Причина репорта:
                    \`\`\`Продажа товаров и услуг.\`\`\`
                    ${profileID.names}, ${profileID.age}
                    ${profileID.status}**
                    `)
                    .setImage(profileID.photo)
                    .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                    .setTimestamp();
                    await ch.send({embeds:[profileEmbesd]})
                    await int.update({embeds:[fd],components:[], ephemeral:true})
                    await generate();
                  break
                  case 'propoganda':
                    const profilesEmbesd = new MessageEmbed()
                    .setTitle('Репорт на анкету')
                    .setDescription(`
                    **Причина репорта:
                    \`\`\`Пропоганда чего-либо.\`\`\`
                    ${profileID.names}, ${profileID.age}
                    ${profileID.status}**
                    `)
                    .setImage(profileID.photo)
                    .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                    .setTimestamp();
                    await ch.send({embeds:[profilesEmbesd]})
                    await int.update({embeds:[fd],components:[], ephemeral:true})
                    await generate();
                  break
                  case 'oskprofile':
                    const profilsesEmbesd = new MessageEmbed()
                    .setTitle('Репорт на анкету')
                    .setDescription(`
                    **Причина репорта:
                    \`\`\`Оскорбительный профиль.\`\`\`
                    ${profileID.names}, ${profileID.age}
                    ${profileID.status}**
                    `)
                    .setImage(profileID.photo)
                    .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                    .setTimestamp();
                    await ch.send({embeds:[profilsesEmbesd]})
                    await int.update({embeds:[fd],components:[], ephemeral:true})
                    await generate();
                  break
                  case 'drugoe':
              let gg = int.reply({content:'Напишите причину жалобы, у вас есть на это 1 минута:', ephemeral:true, fetchReply:true})
              const filter = (message) => message.author.id === interaction.user.id;
              var col1 = await interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });
              col1.on("collect", async (m) => {
                  m.delete().catch(() => { });
                  if (m.content.length > 250) return m.reply({ content: "Максимальное кол-во символов 250!", ephemeral:true })
                  const profilsesEmbesd = new MessageEmbed()
                  .setTitle('Репорт на анкету')
                  .setDescription(`
                  **Причина репорта:
                  \`\`\`${m.content}\`\`\`
                  ${profileID.names}, ${profileID.age}
                  ${profileID.status}**
                  `)
                  .setImage(profileID.photo)
                  .setFooter({ text: `Выполнил: ${interaction.user.tag}` })
                  .setTimestamp();
                  await ch.send({embeds:[profilsesEmbesd]})
                  await int.followUp({content:"Вы успешно отправили репорт", ephemeral:true})
                  await generate();
              })
            break
                }
              }
              })
              // await generate();
            break;
            case 'delete':
            await interaction.deleteReply()
            break
          }
         })
       
         await generate()
       }
       getAndSendRandomProfile(interaction)
         }
   }
}