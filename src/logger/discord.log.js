'use strict';

import { Client, GatewayIntentBits } from 'discord.js';
import mongoose from 'mongoose';
import os from 'os';
import process from 'process';
import dotenv from 'dotenv'

dotenv.config()


class LoggerService {
    constructor() {
        this.discordClient = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        // channel id
        this.channelId = process.env.CHANNELID_DISCORD_SERVER;

        this.discordClient.on('ready', () => {
            console.log(`Logged is as ${this.discordClient.user.tag}`);
        });

        this.discordClient.login(process.env.CHANNELID_DISCORD_BOT_TOKEN);

        const _SECOND = 15000; // interval time
        setInterval(() => {
            const numConnections = mongoose.connections.length;
            const numCores = os.cpus().length;
            const memoryUsage = process.memoryUsage().rss / (1024 * 1024);
            // example maximum number of connections based on number of corse


            const message = {
                embeds: [
                    {
                        title: `📉 Performance Metric`,
                        color: parseInt('1abc9c', 16), // xanh ngọc
                        fields: [
                            {
                                name: 'Number of connections to MongoDB',
                                value: numConnections,
                                inline: false,
                            },
                            {
                                name: 'Cores usage',
                                value: numCores,
                                inline: false,
                            },
                            {
                                name: 'Memory usage',
                                value: `Memory usage: ${memoryUsage.toFixed(2)} MB`,
                                inline: false,
                            },
                            {
                                name: 'Timestamp',
                                value: new Date().toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false, 
                                }),
                                inline: false,
                            },
                        ],
                    },
                ],
            };
            this.sendToMessage(message);
        }, _SECOND); //monitor every 5 seconds
    }

    sendToFormatcode(logData) {
        const {
            code,
            message = 'This is some additional information about the code',
            title = 'Code example',
        } = logData;
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16), // convert hexadecimal to integer
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ],
        };
        // this.logPerformance()
        this.sendToMessage(codeMessage);
    }

    sendToMessage(message = 'message') {
        const channel = this.discordClient.channels.cache.get(this.channelId);
        if (!channel) {
            console.log(`Counldn't find the channel....`, this.channelId);
            return;
        }

        // message use chatgpt api code
        channel.send(message).catch((e) => console.error(e));
    }
}

export default new LoggerService();
