let lastUser = "相手";

let note = [];


function addMessage(user,text){

    note.push({
        user: user,
        text: text
    }) ;

    localStorage.setItem("note", JSON.stringify(note));

    displayMessages();
  

}



const input = document.getElementById("messageInput");
const button = document.getElementById("sendButton");
const messages = document.getElementById("messages");
const replyButton = document.getElementById("replyButton");
const replyInput =document.getElementById("replyInput");

function displayMessages(){

    messages.innerHTML = "";

    for (let i = 0; i < note.length; i++){

        const message = document.createElement("div");

        message.className = "mesasge";

        message.textContent = 
             note[i].user + ":" + note [i].text;

        messages.appendChild(message);          
    }
}


button.addEventListener("click", function () {
    if (lastUser === "あなた"){
        alert("相手の返信待ちです");
        return;

    } 

    const text = input.value;

    if (text === "") {
        alert("メッセージを入力してください");
        return;
    }

   addMessage("あなた", text);
    lastUser = "あなた";

    input.value = "";
});

replyButton.addEventListener("click", function(){

    if(lastUser === "相手"){
        alert("あなたの返信待ちです");
        return;

    }

    const text = replyInput.value;

    if(text === ""){
        alert("相手のメッセージを入力してください");
        return;

    }

    addMessage("相手",text);

    lastUser = "相手";

    replyInput.value = "";

});

const saveNote = localStorage.getItem("note");

if(saveNote){

    note = JSON.parse(saveNote);

    displayMessages();
}