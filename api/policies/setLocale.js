// find language of query and set it as local
module.exports = async (req, res, proceed) => {
    let lang = req.query.lang;
    // if lang then set it
    if (lang) {
        req.setLocale(lang);
    } else {
        // else set it to en language
        req.setLocale('en');
    }
    // proceed to next step
    return proceed();
};