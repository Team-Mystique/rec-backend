const home = (req, res) => {
    res.json({ message: 'Welcome to the Rise Edu Consult Backend API!' });
}

module.exports = { home };