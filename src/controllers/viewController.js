export default class ViewController {

    loginPage(req, res) {
        const errorMessage = req.query.error;
        const registerSuccess = req.query.registerSuccess;
        res.render("index", {
            error: errorMessage ? errorMessage : "",
            registerSuccess: registerSuccess ? registerSuccess : ""
        });
    }

    chatPage(req, res) {
        res.render("chatRoom", { layout: false });
    }

}