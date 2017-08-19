module.exports = {
  sendError: function sendError (response, err) {
	    var out = {
	      error: {
	        code: err.code || 500,
	        title: err.title,
	        message: err.message
	      }
	    }
	    response.send(out)
  }
}
