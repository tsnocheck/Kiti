"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../class/Command");
const canvas_1 = require("canvas");
const discord_js_2 = require("discord.js");
const ROWS = 20;
const COLUMNS = 20;
const CELL_SIZE = 20;
exports.default = new Command_1.Command({
    command_data: new discord_js_2.SlashCommandBuilder()
        .setName('змейка')
        .setDescription('змейка хуле')
        .toJSON(),
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const canvas = (0, canvas_1.createCanvas)(CELL_SIZE * COLUMNS, CELL_SIZE * ROWS);
            const ctx = canvas.getContext('2d');
            const gameState = {
                snake: [
                    { x: 10, y: 10 },
                    { x: 9, y: 10 },
                    { x: 8, y: 10 },
                ],
                food: { x: 5, y: 5 },
                direction: 'right',
            };
            setInterval(() => {
                moveSnake(gameState);
                drawGame(ctx, gameState);
            }, 100);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Змейка')
                .setDescription('Используйте кнопки, чтобы управлять змейкой')
                .setImage('attachment://snake.png');
            const but = new discord_js_2.ActionRowBuilder()
                .addComponents(new discord_js_2.ButtonBuilder()
                .setCustomId('up')
                .setLabel('↑')
                .setStyle(discord_js_2.ButtonStyle.Secondary), new discord_js_2.ButtonBuilder()
                .setCustomId('down')
                .setLabel('вверх')
                .setStyle(discord_js_2.ButtonStyle.Secondary), new discord_js_2.ButtonBuilder()
                .setCustomId('left')
                .setLabel('←')
                .setStyle(discord_js_2.ButtonStyle.Secondary), new discord_js_2.ButtonBuilder()
                .setCustomId('right')
                .setLabel('→')
                .setStyle(discord_js_2.ButtonStyle.Secondary));
            yield interaction.reply({
                embeds: [embed],
                files: [canvas.toBuffer('image/png')],
                components: [but],
            });
            const filter = (i) => i.customId === 'up' ||
                i.customId === 'down' ||
                i.customId === 'left' ||
                i.customId === 'right';
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                time: 1000 * 60 * 5, // 5 minutes
            });
            collector.on('collect', (i) => {
                switch (i.customId) {
                    case 'up':
                        gameState.direction = 'up';
                        break;
                    case 'down':
                        gameState.direction = 'down';
                        break;
                    case 'left':
                        gameState.direction = 'left';
                        break;
                    case 'right':
                        gameState.direction = 'right';
                        break;
                }
            });
            // collector.on('end', () => {
            //   embed.setDescription('Время истекло!');
            //   interaction.editReply({ embeds: [embed], components: [] });
            // });
            function moveSnake(gameState) {
                const head = Object.assign({}, gameState.snake[0]);
                switch (gameState.direction) {
                    case 'up':
                        head.y -= 1;
                        break;
                    case 'down':
                        head.y += 1;
                        break;
                    case 'left':
                        head.x -= 1;
                        break;
                    case 'right':
                        head.x += 1;
                        break;
                }
                gameState.snake.unshift(head);
                if (head.x === gameState.food.x && head.y === gameState.food.y) {
                    generateFood(gameState);
                }
                else {
                    gameState.snake.pop();
                }
                if (isCollidingWithWall(gameState) || isCollidingWithSelf(gameState)) {
                    gameOver(gameState);
                }
            }
            function generateFood(gameState) {
                let foodX = Math.floor(Math.random() * COLUMNS);
                let foodY = Math.floor(Math.random() * ROWS);
                // Make sure the food is not generated on top of the snake
                while (gameState.snake.some((cell) => cell.x === foodX && cell.y === foodY)) {
                    foodX = Math.floor(Math.random() * COLUMNS);
                    foodY = Math.floor(Math.random() * ROWS);
                }
                gameState.food = { x: foodX, y: foodY };
            }
            function isCollidingWithWall(gameState) {
                const head = gameState.snake[0];
                return (head.x < 0 || head.x >= COLUMNS || head.y < 0 || head.y >= ROWS);
            }
            function isCollidingWithSelf(gameState) {
                const head = gameState.snake[0];
                return gameState.snake.slice(1).some((cell) => cell.x === head.x && cell.y === head.y);
            }
            function drawGame(ctx, gameState) {
                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw the snake
                ctx.fillStyle = 'green';
                for (const cell of gameState.snake) {
                    ctx.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
                // Draw the food
                ctx.fillStyle = 'red';
                ctx.fillRect(gameState.food.x * CELL_SIZE, gameState.food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
            function gameOver(gameState) {
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle('Игра окончена')
                    .setDescription(`Вы набрали ${gameState.snake.length - 3} очков!`);
                interaction.editReply({ embeds: [embed], components: [] });
            }
        }
        catch (_a) {
            console.error();
        }
    })
});
