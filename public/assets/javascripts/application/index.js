$(function () {
  var loader = $('.loading-container')
  $('#faucetForm').submit(function (e) {
    e.preventDefault()
    	$this = $(this)
    loader.removeClass('hidden')
    var receiver = $('#receiver').val()
    $.ajax({
		  	url: '/',
		  	type: 'POST',
		  	data: $this.serialize()
    }).done(function (data) {
      if (!data.success) {
        loader.addClass('hidden')
        if (data.error) {
          swal(data.error.title || '', data.error.message || '', 'error')
        } else {
          swal('An unknown error occurred', 'error')
        }
        return
      }

      getTxCallBack(data.success.txHash, function () {
        $('#receiver').val('')
        loader.addClass('hidden')
        swal('Success',
				  '0.5 ETH is successfully transfered to ' + receiver,
				  'success'
				)
        grecaptcha.reset()
      })
    }).fail(function (err) {
      console.log(err)
      loader.addClass('hidden')
    })
  })
})
