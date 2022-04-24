function readImage(element) {
    $('#d2 h3').text(' ');
    var file = element.files[0];
    var reader = new FileReader();
    
    var image = document.getElementById('output');
  	image.src = URL.createObjectURL(element.files[0]);
    
    reader.onloadend = function() {
      $.ajax({
        url: "https://eastus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/24154590-8979-4933-8905-6e853e3e7dc2/classify/iterations/RecycleModel/image",
        data: reader.result,
        processData: false,
        contentType: "application/octet-streama",
        headers: {
          'Prediction-key': '542d3c158e4f4a2989c2a2771314e832'
        },
        type: 'POST',
        success: function(response) {
          localStorage.setItem("prediction",JSON.stringify(response))
        },
        error: function(error) {
          alert('error: ' + error);
        }
      });
    }
    reader.readAsArrayBuffer(file);
}



