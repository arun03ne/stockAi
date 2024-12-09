const dropArea = document.getElementById("drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
previewArea = document.getElementById("preview-area");
closeBtn = document.getElementById("closeBtn");
uploadBtn = document.getElementById("upload_btn");
let file; //this is a global variable and we'll use it inside multiple functions
let response;
button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  previewArea.classList.add("active");
  showFile(); //calling function
});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  previewArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault();
  file = event.dataTransfer.files[0];
  showFile();
});

function showFile(){
  let fileType = file.type;
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
  if(validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = ()=>{
      let fileURL = fileReader.result;
  	  let imgTag = `<img src="${fileURL}" alt="image">`;
      uploadBtn.style.display = 'block';
      previewArea.innerHTML = imgTag;
      dropArea.style.display = 'none';
      closeBtn.style.display = 'block';
      previewArea.style.display = 'block';
    }
    fileReader.readAsDataURL(file);
  }else{
    uploadBtn.style.display = 'none';
    dropArea.style.display = 'flex';
    closeBtn.style.display = 'none';
    previewArea.style.display = 'none';
    alert("This is not an Image File!");
    previewArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

function removeImage() {
  previewArea.innerHTML = "";
  dropArea.style.display = 'flex';
  closeBtn.style.display = 'none';
  previewArea.style.display = 'none';
  uploadBtn.style.display = 'none';
  input.value = "";
}

async function uploadImage(event) {
  if(!file) {
    alert("This is not an Image File!");
    return
  }
  document.getElementById("blinking-box").classList.add("blinking-box");
  event.preventDefault()
  const formData = new FormData();
  formData.append('file', file);
  axios.post('https://pyst.azurewebsites.net/api/http_trigger1?code=RdUIwntBCNfmeAohJHZgXlyR3rq8LOTaXUk-d6aK4a7SAzFusWuB6A%3D%3D', formData).then(
    (result) => {

        const data = JSON.parse(result?.data?.data);
        console.log(data)
        const choices = data.choices || [];
        if (choices.length === 0) throw new Error("'choices' array is empty or missing.");
        const message = choices[0]?.message?.content;
        if (!message) throw new Error("Missing 'content' in message.");
        console.log(message)

        const jsonString = message.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(jsonString);

        console.log("testdfsfsdfsdfsdf sdfsdfsd fdsfdsfsd ")
        console.log(parsedData)

       

        // response = result?.data?.data; 
        response = result?.data?.data;
        response = response.replaceAll('\\n', '<br>')
        response = response.replaceAll('\\', '')
        response = response.replaceAll('json', '')
        response = response.replaceAll(`''`, '')
        console.log(typeof(response))
        console.log(response.replaceAll(/\n/g, '<br>'));
        document.getElementById("blinking-box").classList.remove("blinking-box");
        // const characterElement = document.createElement('line1');
        // characterElement.innerText = `Character Name: ${response.info}`;
        // charactersDiv.append(characterElement);
        document.getElementById('line1').innerHTML = JSON.stringify(parsedData, null, 2) ;
    },
    (error) => {
        console.log(error);
    }
);
}

 function showText(text) {
      document.getElementById("blinking-box").classList.add("blinking-box");
      const characterElement = document.getElementById('line1');
      let currentValue = characterElement.innerText;
      console.log(currentValue);
      currentValue = currentValue + '<br>' + text;
      characterElement.innerHTML = currentValue;
      document.getElementById("blinking-box").classList.remove("blinking-box");
      // document.getElementById('line1').append(text);

}