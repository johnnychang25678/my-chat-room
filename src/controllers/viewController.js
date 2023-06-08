export default class ViewController {

    loginPage(req, res) {
        res.render("index");
    }

    chatPage(req, res) {
        res.render("chatRoom", { layout: false });
    }

}