const {
	title
} = require('process');
try {

	const { default: makeWASocket, makeCacheableSignalKeyStore, downloadContentFromMessage, useMultiFileAuthState, makeInMemoryStore, DisconnectReason, WAGroupMetadata, relayWAMessage, MediaPathMap, mentionedJid, processTime, MediaType, Browser, MessageType, Presence, Mimetype, Browsers, delay, fetchLatestBaileysVersion, MessageRetryMap, extractGroupMetadata, generateWAMessageFromContent, proto, prepareWAMessageMedia } = require('@whiskeysockets/baileys');
	const mimetype = require("mime-types");
	prepareWAMessageMedia;
	const fs = require('fs');
	const P = require('pino');
	const path = require('path');
	const chalk = require('chalk');
	const moment = require('moment-timezone');
	const clc = require('cli-color');
	const NodeCache = require('node-cache');
	const readline = require("readline");
	const axios = require('axios');
	const ffmpeg = require('fluent-ffmpeg');
	const cfonts = require('cfonts')
	const { exec, spawn, execSync } = require("child_process")
	const speed = require("performance-now");
	const { ndown, tikdown, ytdown } = require("nayan-media-downloader")

	const sleep = async (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }
	const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) }
	
	const auto_sticker = JSON.parse(fs.readFileSync('./data/functions/autosticker.json'))
	const infoBot = JSON.parse(fs.readFileSync('./config.json'));

	var prefix = infoBot.prefix
	var nomeBot = infoBot.nomeBot
	var NomeBot = infoBot.nomeBot
	var nomeDono = infoBot.nomeDono
	var SoDono = infoBot.numeroDono
	var link = infoBot.link
	var numeroDono = infoBot.numeroDono


	const useStore = !process.argv.includes('--no-store')
	const doReplies = !process.argv.includes('--no-reply')
	const useMobile = process.argv.includes('--mobile')
	const usePairingCode = process.argv.includes('--use-pairing-code')
	const msgRetryCounterCache = new NodeCache();
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout, });
	async function starts() {
		const { state, saveCreds } = await useMultiFileAuthState('./src/whatsapp_session')
		const { version } = await fetchLatestBaileysVersion();
		const question = (text) => new Promise((resolve) => rl.question(text, resolve));
		const store = makeInMemoryStore({
		  logger: P().child({
			level: 'debug',
			stream: 'store'
		  })
		})
	
		const client = makeWASocket({
			version,
			logger: P({ level: "silent" }),
			usePairingCode,
			mobile: false,
			browser: ["FireFox (linux)"],
			auth: state,
			msgRetryCounterCache,
			defaultQueryTimeoutMs: undefined,
			patchMessageBeforeSending: (message) => {
				const requiresPatch = !!(message.buttonsMessage || message.listMessage);
				if (requiresPatch) {
					message = {
						viewOnceMessage: {
							message: {
								messageContextInfo: {
									deviceListMetadataVersion: 2,
									deviceListMetadata: {},
								}, ...message
							}
						}
					}
				}
				return message;
			}
		});
	
		//console.log(banner.string)
		console.log(`
░▒█▀▄▀█░░▀░░█▀▀░▄▀▀▄░░░░█▀▀▄░▄▀▀▄░▀█▀░░░▄▀▀▄░█▀▀▄░█░░░▀░░█▀▀▄░█▀▀░█░░
░▒█▒█▒█░░█▀░▀▀▄░█░░█░▀▀░█▀▀▄░█░░█░░█░░░░█░░█░█░▒█░█░░░█▀░█░▒█░█▀▀░▀░░
░▒█░░▒█░▀▀▀░▀▀▀░░▀▀░░░░░▀▀▀▀░░▀▀░░░▀░░░░░▀▀░░▀░░▀░▀▀░▀▀▀░▀░░▀░▀▀▀░▄░░
`)
	function limparNumero(entrada) {
		const numeros = entrada.replace(/\D/g, '');
		const numeroLimpo = numeros.replace(/^(\d{2})(9)?(\d{8,9})$/, '$1$3');
		return numeroLimpo;
	}
	
		if (!client.authState.creds.registered) {
			const phoneNumber = await question(`\nDigite seu número do WhatsApp:\nEx: ${clc.bold("+5511994549375")}\n `);
	const numeroLimpo = limparNumero(phoneNumber);
			const code = await client.requestPairingCode(numeroLimpo);
			console.log(`Seu código de conexão é: \n\n ${clc.bold(code)}\n~>`);
			console.log(`Abra seu WhatsApp, em ${clc.bold("Aparelhos Conectados > Conectar um novo Aparelho > Conectar usando Número.")}`)
		}
	
		store.bind(client.ev)
	
		client.ev.on("creds.update", saveCreds)
		store.bind(client.ev)
		client.ev.on("chats.set", () => {
			console.log("Tem conversas", store.chats.all())
		})
		client.ev.on("contacts.set", () => {
			console.log("Tem contatos", Object.values(store.contacts))
		})
		// CONEXÃO ATUALIZAÇÃO 
		client.ev.on("connection.update", (update) => {
			const { connection, lastDisconnect } = update
			if (connection === "close") {
				const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
				console.log("Conexão fechada devido a", lastDisconnect.error, "Tentando reconectar...", shouldReconnect);
				if (shouldReconnect) {
					starts()
				}
	
			} else if (connection === "open") {
				console.log(chalk.keyword("red")(`
░▄▀▀░▄▀▄░█▄░█▒██▀░▄▀▀░▀█▀▒▄▀▄░█▀▄░▄▀▄░░░▄▀▀░▄▀▄░█▄▒▄█░░░▄▀▀░█▒█░▄▀▀▒██▀░▄▀▀░▄▀▀░▄▀▄░█
░▀▄▄░▀▄▀░█▒▀█░█▄▄░▀▄▄░▒█▒░█▀█▒█▄▀░▀▄▀▒░░▀▄▄░▀▄▀░█▒▀▒█▒░▒▄██░▀▄█░▀▄▄░█▄▄▒▄██▒▄██░▀▄▀░▄

					`));
			}
		})

	
		// MENSAGEM ATUALIZAÇÃO 
		client.ev.on('messages.upsert', async connection => {
			//console.log(connection)
			const info = connection.messages[0];
			//if (info.key.fromMe) return;
			if (connection.type != 'notify') return;
			if (info.key.remoteJid === 'status@broadcast') return;
			try {
				function getGroupAdmins(participants) {
					admins = []
					for (let i of participants) {
						if (i.admin == 'admin') admins.push(i.id)
						if (i.admin == 'superadmin') admins.push(i.id)
					}
					return admins
				}
				const getRandom = (ext) => {
					return `${Math.floor(Math.random() * 10000)}${ext}`
				}
				const getExtension = async (type) => {
					return await mimetype.extension(type)
				}
				const getBuffer = (url, options) => new Promise(async (resolve, reject) => {
					options ? options : {}
					await axios({
						method: "get",
						url,
						headers: {
							"DNT": 1,
							"Upgrade-Insecure-Request": 1
						},
						...options,
						responseType: "arraybuffer"
					}).then((res) => {
						resolve(res.data)
					}).catch(reject)
				})

				if (!info.message) return
				if (info.key && info.key.remoteJid == 'status@broadcast') return
				const type = Object.keys(info.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(info.message)[2] : (Object.keys(info.message)[0] == 'messageContextInfo') ? Object.keys(info.message)[1] : Object.keys(info.message)[0]
				const content = JSON.stringify(info.message);
				const altpdf = Object.keys(info.message)
				global.prefix
				const from = info.key.remoteJid
				var body = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || info.message?.buttonsResponseMessage?.selectedButtonId || info.message?.listResponseMessage?.singleSelectReply?.selectedRowId || info.message?.templateButtonReplyMessage?.selectedId || info?.text || ""

				const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''
				const reply = (text) => {
					client.sendMessage(from, { text: text }, { quoted: info } ) }

				const menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant
				var pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : ''
				const quoted = info.quoted ? info.quoted : info

				const pushname = info.pushName ? info.pushName : ''
				const username = info.username ? info.username : ''
				
				const isGroup = info.key.remoteJid.endsWith('@g.us')
				const sender = isGroup ? info.key.participant : info.key.remoteJid


				const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
				const groupName = isGroup ? groupMetadata.subject : ''
				selectedButton = (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : ''
				const groupDesc = isGroup ? groupMetadata.desc : ''
				const participants = isGroup ? await groupMetadata.participants : ''
				const groupMembers = isGroup ? groupMetadata.participants : ''
				const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
				const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
				const argss = body.split(/ +/g)
				const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net'
				const args = body.trim().split(/ +/).slice(1);
				const text = args.join(" ")
				const menc_jid = args.join(" ").replace("@", "") + "@s.whatsapp.net"
				const isCmd = body.startsWith(prefix);
				const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
				const mentions = (teks, memberr, id) => {
					(id == null || id == undefined || id == false) ? client.sendMessage(from, {
						text: teks.trim(),
						mentions: memberr
					}): client.sendMessage(from, {
						text: teks.trim(),
						mentions: memberr
					})
				}

				const isImage = type == 'imageMessage'
				const isVideo = type == 'videoMessage'
				const isAudio = type == 'audioMessage'
				const isSticker = type == 'stickerMessage'
				const isContact = type == 'contactMessage'
				const isLocation = type == 'locationMessage'
				const isProduct = type == 'productMessage'
				const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage')
				typeMessage = body.substr(0, 50).replace(/\n/g, '')
				if (isImage) typeMessage = "Image"
				else if (isVideo) typeMessage = "Video"
				else if (isAudio) typeMessage = "Audio"
				else if (isSticker) typeMessage = "Sticker"
				else if (isContact) typeMessage = "Contact"
				else if (isLocation) typeMessage = "Location"
				else if (isProduct) typeMessage = "Product"
				const isQuotedMsg = type === 'extendedTextMessage' && content.includes('textMessage')
				const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
				const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
				const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
				const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
				const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
				const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
				const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
				const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')
				const getFileBuffer = async (mediakey, MediaType) => {
					const stream = await downloadContentFromMessage(mediakey, MediaType)
					let buffer = Buffer.from([])
					for await (const chunk of stream) {
						buffer = Buffer.concat([buffer, chunk])
					}
					return buffer
				}
				const isAutoSticker = isGroup ? auto_sticker.includes(from) : false
				const isBot = info.key.fromMe ? true : false
				const isGroupAdmins = groupAdmins.includes(sender) || false
				const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
				const isOwner = sender.includes(infoBot.numeroDono)
				q = args.join(" ")

				if (isAutoSticker && isGroup && isMedia) {
					sleep(2000)
					async function auto_stkr() {
					  const cacheDir = './cache';
					  if (!fs.existsSync(cacheDir)) {
						fs.mkdirSync(cacheDir);
					  }
				  
					  var legenda = `Criado pela Misö\nPor ${pushname}\ndarkenemies.com.br`
					  var autor = `\n@imisobot`
					  if (isMedia && !info.message.videoMessage || isQuotedImage) {
						var encmedia = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage;
						rane = path.join(cacheDir, getRandom('.' + await getExtension(encmedia.mimetype)));
						buffimg = await getFileBuffer(encmedia, 'image');
						fs.writeFileSync(rane, buffimg);
						rano = path.join(cacheDir, getRandom('.webp'));
						exec(`ffmpeg -i ${rane} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 800:800 ${rano}`, (err) => {
						  fs.unlinkSync(rane);
						  var json = {
							"sticker-pack-name": legenda,
							"sticker-pack-publisher": autor
						  };
						  var exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
						  var jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
						  var exif = Buffer.concat([exifAttr, jsonBuff]);
						  exif.writeUIntLE(jsonBuff.length, 14, 4);
						  let nomemeta = path.join(cacheDir, Math.floor(Math.random() * (99999 - 11111 + 1) + 11111) + ".temp.exif");
						  fs.writeFileSync(nomemeta, exif);
						  exec(`webpmux -set exif ${nomemeta} ${rano} -o ${rano}`, () => {
							client.sendMessage(from, { sticker: fs.readFileSync(rano) }, { quoted: info });
							fs.unlinkSync(nomemeta);
							fs.unlinkSync(rano);
						  });
						});
					  } else if (isMedia && info.message.videoMessage.seconds < 11 || isQuotedVideo && info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 35) {
						var encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage;
						rane = path.join(cacheDir, getRandom('.' + await getExtension(encmedia.mimetype)));
						buffimg = await getFileBuffer(encmedia, 'video');
						fs.writeFileSync(rane, buffimg);
						rano = path.join(cacheDir, getRandom('.webp'));
						await ffmpeg(`./${rane}`).inputFormat(rane.split('.')[1]);
						exec(`ffmpeg -i ${rane} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 200:200 ${rano}`, (err) => {
						  fs.unlinkSync(rane);
						  let json = {
							"sticker-pack-name": legenda,
							"sticker-pack-publisher": autor
						  };
						  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
						  let jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
						  let exif = Buffer.concat([exifAttr, jsonBuff]);
						  exif.writeUIntLE(jsonBuff.length, 14, 4);
						  let nomemeta = path.join(cacheDir, "temp.exif");
						  fs.writeFileSync(nomemeta, exif);
						  exec(`webpmux -set exif ${nomemeta} ${rano} -o ${rano}`, () => {
							client.sendMessage(from, { sticker: fs.readFileSync(rano) }, { quoted: info });
							fs.unlinkSync(nomemeta);
							fs.unlinkSync(rano);
						  });
						});
					  } else {
						reply(`Você precisa enviar ou marcar uma imagem ou vídeo com no máximo 10 segundos`);
					  }
					}
				  
					auto_stkr().catch(e => {
					  console.log(e);
					  reply("> Erro[!#]");
					  try {
						if (fs.existsSync(path.join('./cache', 'temp.exif'))) fs.unlinkSync(path.join('./cache', 'temp.exif'));
						if (fs.existsSync(rano)) fs.unlinkSync(rano);
						if (fs.existsSync(media)) fs.unlinkSync(media);
					  } catch { }
					});
				  }
				  
				if (isGroup) {
					if (isCmd && !isBot) {
					  console.log(
						color(`\nMensagem em Grupo`, 'blue'),
						color(`\nComando: ${command}`, 'red'),
						color(`\nNúmero: ${sender.split("@")[0]}`, 'red'),
						color(`\nGrupo: ${groupName}`, 'red'),
						color(`\nNome: ${pushname}`, 'red'))
					} else if (!isBot) {
					  console.log(
						color(`\nMensagem em Grupo`, 'blue'),
						color(`\nNúmero: ${color('Não', 'red')}`, 'orange'),
						color(`\nNúmero: ${sender.split("@")[0]}`, 'red'),
						color(`\nGrupo: ${groupName}`, 'red'),
						color(`\nNome: ${pushname}`, 'red'))
					}
				  } else {
					if (isCmd && !isBot) {
					  console.log(
						color(`\nMensagem no Privado`, 'blue'),
						color(`\nComando: ${command}`, 'red'),
						color(`\nNúmero: ${sender.split("@")[0]}`, 'red'),
						color(`\nNome: ${pushname}`, 'red'))
					} else if (!isBot) {
					  console.log(
						color(`\nMensagem no Privado`, 'blue'),
						color(`\nComando: ${color('Não', 'red')}`, 'orange'),
						color(`\nNúmero: ${sender.split("@")[0]}`, 'red'),
						color(`\nNome: ${pushname}`, 'red'))
					}
				  }

				switch (command) {

					case 'play':
						if (!q) return reply(`> Você precisa digitar o nome de alguma música [!#]`)

						reply(`> processando...`)
						const yts = require("yt-search")
						const yts_r = await yts(q).videos
						const play_fetch = await ytdown(yts_r.url).data


						await client.relayMessage(from, {
							extendedTextMessage: {
								text: infoText,
								contextInfo: {
									externalAdReply: {
										title: "miso",
										body: "",
										mediaType: 1,
										previewType: 0,
										renderLargerThumbnail: true,
										thumbnailUrl: yts_r.thumbnail,
										sourceUrl: url
									}}, quoted: live }, }, {});

						await client.sendMessage(from, {
							audio: play_fetch.audio,
							mimetype: 'audio/mpeg'
						}, {
							quoted: live
						});
					break

					case 'autosticker':
						if (!isGroup) return
						if (!isGroupAdmins) return
						if (!isBotGroupAdmins) return
						if (Number(args[0]) === 1) {
						  if (isAutoSticker) return reply('> o recurso se encontra ativo.');
						  auto_sticker.push(from);
						  fs.writeFileSync('./data/functions/autosticker.json', JSON.stringify(auto_sticker));
						  reply('> Recurso de autosticker Ativado!');
						} else if (Number(args[0]) === 0) {
						  if (!isAutoSticker) return reply('> o recurso se encontra inativo.');
						  pesquisar = from;
						  processo = autosticker.indexOf(pesquisar);
						  while (processo >= 0) {
							auto_sticker.splice(processo, 1);
							processo = autosticker.indexOf(pesquisar);
						  }
						  fs.writeFileSync('./data/functions/autosticker.json', JSON.stringify(auto_sticker));
						  reply('> Recurso de autosticker desativado!');
						}
						break;
			
				

						
					
				}} catch (e) {
				console.log(e)
			}
		});

	}
	starts();

} catch (error) {
	console.error("Ocorreu um erro:", error);
}
