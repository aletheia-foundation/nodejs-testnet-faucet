module.exports = {
  sendError: function sendError (response, err) {
    const out = {
      error: {
        code: err.code,
        title: err.title,
        message: err.message
      }
    }
    response.send(out)
  }
}
