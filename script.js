console.log("script loaded");

const supabaseUrl = "https://vfocwywoupizsfetubzk.supabase.co";
const supabaseKey = "sb_publishable_lqQbe0mELE1iBzwUkOeGvA_nCEJZ7IS";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

let lastUser = "相手";


let note = [];


async function addMessage(user,text){

   const { error } =
       await supabaseClient
          .from("messages")
          .insert([
            {
                user: user,
                text: text
            }
          ]);
        
console.log("保存結果:", error);
  

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

        message.className = "message";

        message.textContent = 
             note[i].user + ":" + note [i].text;

        messages.appendChild(message);          
    }
}


button.addEventListener("click", async function () {
    if (lastUser === "あなた"){
        alert("相手の返信待ちです");
        return;

    } 

    const text = input.value;

    if (text === "") {
        alert("メッセージを入力してください");
        return;
    }

   await addMessage("あなた", text);

    lastUser = "あなた";

    input.value = "";
});

replyButton.addEventListener("click", async function() {

    if(lastUser === "相手"){
        alert("あなたの返信待ちです");
        return;

    }

    const text = replyInput.value;

    if(text === ""){
        alert("相手のメッセージを入力してください");
        return;

    }

    await addMessage("相手",text);

    lastUser = "相手";

    replyInput.value = "";

});


console.log(supabaseClient);

async function loadMessages() {

    const { data, error } =
        await supabaseClient
            .from("messages")
            .select("*")
            .order("id");

    if(error){
        console.log(error);
        return;
    }        

    note = data;

    displayMessages();
}

loadMessages();    

supabaseClient
.channel("messages-channel")
.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "messages"
    },

    async (payload) => {
       
        console .log("Realtime受信:", payload);

        await loadMessages();
    }
)
.subscribe((status) => {

    console.log("Realtime:", status);

});