export default class ViewController {

    loginPage(req, res) {
        const errorMessage = req.query.error;
        res.render("index", { error: errorMessage ? errorMessage : "" });
    }

    chatPage(req, res) {
        res.render("chatRoom", { layout: false });
    }

}