export default class MessageController {
    constructor(messageModel) {
        this.messageModel = messageModel;

        this.getMessages = this.getMessages.bind(this);
    }

    async getMessages(req, res, next) {
        const messages = await this.messageModel.selectAll();
        res.json({ messages });
    }
}