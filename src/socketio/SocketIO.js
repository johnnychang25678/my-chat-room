
import { Server } from "socket.io";

export default class SocketIO {
    constructor(httpServer, messageModel, userModel) {
        this.io = new Server(httpServer);
        this.messageModel = messageModel;
        this.userModel = userModel;

        this.init = this.init.bind(this);
    }

    init() {
        this.io.on("connection", (socket) => {
            // socket listens to message from client
            // ioServer sends message to everyone
            socket.on("message", async (receive) => {
                await this.messageModel.insert(receive);
                this.io.emit("message", receive);
            });

            socket.on("disconnect", () => {
                console.log("disconnect from client");
                socket.disconnect();
            });
        });
    }
}