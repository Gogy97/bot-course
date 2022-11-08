const TelegramApi = require('node-telegram-bot-api')
const{againOptions,gameOptions} = require ('./options')
const token = '5658639967:AAG5epWIngvrmVFwjYI2_2Xu3yTYD-uHtAQ'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Я загадал число  от 0 до 9, а ты отгадай')
    const ran = Math.floor(Math.random() * 10)
    chats[chatId] = ran
    await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Отгадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ab5/72e/ab572ec1-3f88-4fb5-b80b-fb5c4421594c/1.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот Перчик')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Твое имя ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, "Я тебя не понял")


    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не отгадал цифру ${chats[chatId]}`, againOptions)
        }

        console.log(msg)
    })

}
start()